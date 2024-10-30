using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using NASSTBACKEND.Services.Interfaces;
using NASSTBACKEND.Data.ViewModels;
using NASSTBACKEND.Data.InputModels;
using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data;
using NASSTBACKEND.Options;

namespace NASSTBACKEND.Services.General
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly RoleManager<Role> roleManager;
        private readonly NASSTContext context;
        private readonly Security securityOptions;
        private readonly AppConfiguration appConfig;

        public AccountService(IOptions<AppConfiguration> appConfigSection, NASSTContext context, UserManager<User> userManager, SignInManager<User> signInManager, RoleManager<Role> roleManager, IConfiguration configuration,
        IOptions<Security> securityOptions)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.roleManager = roleManager;
            this.securityOptions = securityOptions.Value;
            this.context = context;
            this.appConfig = appConfigSection.Value;

        }

        public async Task<Result<LoginView>> Login(LoginInput input, string ipAddress)
        {
            var user = await userManager.FindByEmailAsync(input.Email ?? "");
            if (user == null || user.IsArchived)
            {
                return Result.BadRequest<LoginView>().With(Error.NotFound("No user with this email was found", path: input.Email));
            }

            var signInResult = await signInManager.CheckPasswordSignInAsync(user, input.Password ?? "", false);
            if (!signInResult.Succeeded)
            {
                return Result.BadRequest<LoginView>().With(Error.IncorrectPassword());
            }


            var token = await GenerateJwtTokenAsync(user);
            var refreshToken = await GenerateRefreshToken(user, ipAddress);


            if (!string.IsNullOrEmpty(input.FCMToken))
            {
                user.FCMToken = input.FCMToken;
                await userManager.UpdateAsync(user);
            }

            return new LoginView
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token.Payload),
                AccessTokenExpiresIn = (int)(token.Payload.ValidTo - DateTime.UtcNow).TotalSeconds,
                RefreshTokenExpiresIn = refreshToken.Payload.Expires != null ? (int)((DateTime)refreshToken.Payload.Expires - DateTime.UtcNow).TotalDays + 1 : -1,
                RefreshToken = refreshToken.Payload.Token,
            };
        }

        public async Task<Result<LoginView>> RefreshToken(string token, string ipAddress)
        {
            var refreshToken = context.UserRefreshTokens.FirstOrDefault(t => t.Token == token);

            if (refreshToken == null)
            {
                return Result.NotFound<LoginView>().With(Error.NotFound("Refresh token was not found", path: token));
            }

            var user = context.Users.FirstOrDefault(u => u.Id == refreshToken.UserId);

            if (user == null)
            {
                return Result.NotFound<LoginView>().With(Error.NotFound("User was not found", path: token));
            }

            if (!refreshToken.IsActive)
            {
                if (string.IsNullOrEmpty(refreshToken.ReplacedByToken))
                    return Result.NotFound<LoginView>().With(Error.NotFound("Replace token is null", path: token));
                else if (DateTime.UtcNow - refreshToken.Revoked < new TimeSpan(0, 0, 10))
                    return Result.Conflict<LoginView>().With(Error.Conflict("Token already create", path: token));
                else
                    return Result.NotFound<LoginView>().With(Error.NotAcceptable("Something went wrong, please contact the administrator", path: token));
            }
            var newRefreshToken = await GenerateRefreshToken(user, ipAddress);
            if (newRefreshToken == null)
            {
                return Result.Conflict<LoginView>().With(Error.Conflict("Token already created", path: token));
            }
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReplacedByToken = newRefreshToken.Payload.Token;

            await context.SaveChangesAsync();

            var jwtToken = await GenerateJwtTokenAsync(user);

            return new LoginView
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(jwtToken.Payload),
                AccessTokenExpiresIn = (int)(jwtToken.Payload.ValidTo - DateTime.UtcNow).TotalSeconds,
                RefreshTokenExpiresIn = newRefreshToken.Payload.Expires != null ? (int)((DateTime)newRefreshToken.Payload.Expires - DateTime.UtcNow).TotalDays + 1 : -1,
                RefreshToken = newRefreshToken.Payload.Token,
            };
        }

        public static string Random64(string noSpaceCharacters)
        {
            var key = new char[64];
            var random = new Random();
            for (int i = 0; i < key.Length; i++)
            {
                key[i] = noSpaceCharacters[random.Next(0, noSpaceCharacters.Length)];
            }
            return new string(key);
        }
        private async Task<Result<UserRefreshToken>> GenerateRefreshToken(User user, string ipAddress)
        {
            var noSpaceCharacters = "_ABCDEFGHIJKLMNOPRSTUVWXYZabcdefghijklmnoprstuvwxyz0123456789";
            var refreshToken = new UserRefreshToken
            {
                Token = Random64(noSpaceCharacters),
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress,
                Expires = securityOptions.RefreshTokenDaysTimeout != 0 ? DateTime.UtcNow.AddDays(securityOptions.RefreshTokenDaysTimeout) : null,
                UserId = user.Id,
            };
            await context.UserRefreshTokens.AddAsync(refreshToken);
            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                await Console.Out.WriteLineAsync("Refresh Token DbUpdateConcurrencyException: " + ex.Message);
                return Result.NotFound<UserRefreshToken>().With(Error.NotAcceptable("Something went wrong, please contact the administrator"));
            }
            return refreshToken;
        }
        private async Task<Result<JwtSecurityToken>> GenerateJwtTokenAsync(User user)
        {
            try
            {
                var principal = await signInManager.CreateUserPrincipalAsync(user);
                var creds = new SigningCredentials(securityOptions.SecurityKey, SecurityAlgorithms.HmacSha256);
                var exp = DateTime.UtcNow.AddSeconds(securityOptions.TokenTimeout);
                return new JwtSecurityToken(claims: principal.Claims, signingCredentials: creds,
                    expires: exp, issuer: securityOptions.Issuer, audience: securityOptions.Audience);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Result.NotFound<JwtSecurityToken>().With(Error.NotAcceptable("Something went wrong, please contact the administrator"));
            }
        }

        public async Task<Result<User>> Register(RegisterInput input, User user)
        {

            User newUser = new User
            {
                Email = input.Email,
                UserName = input.Email,
                FirstName = input.FirstName,
                LastName = input.LastName,
                FullName = input.FirstName + " " + input.LastName,
                CreatedById = user.Id,

            };

            if (input.Role == null || !Enum.IsDefined(typeof(Roles), input.Role))
            {
                return Result.NotFound<User>().With(Error.NotFound("Role is not defined"));
            }

            var createUser = await userManager.CreateAsync(newUser, input.Password ?? "");
            if (!createUser.Succeeded)
            {
                return Result.Conflict<User>().With(Error.InvalidParameter("Invalid parameters."));
            }
            //include sending emails when regsitering
            await userManager.AddToRoleAsync(newUser, input.Role);
            await context.SaveChangesAsync();
            return newUser;
        }

        public async Task<Result<User>> Logout(User user, string ipAddress, string refreshToken = "")
        {
            var loggedInUser = await context.Users.Where(u => u.Email == user.Email).FirstOrDefaultAsync();
            if (loggedInUser != null)
            {
                if (refreshToken == "" || refreshToken == null)
                {
                    var refreshTokens = await context.UserRefreshTokens.Where(r => r.UserId == loggedInUser.Id).ToListAsync();
                    foreach (var token in refreshTokens)
                    {
                        if (token.IsActive)
                        {
                            token.Revoked = DateTime.UtcNow;
                            token.RevokedByIp = ipAddress;
                        }
                    }
                }
                else
                {
                    var token = await context.UserRefreshTokens.FirstOrDefaultAsync(t => t.UserId == loggedInUser.Id && t.Token == refreshToken);
                    if (token != null)
                    {
                        token.Revoked = DateTime.UtcNow;
                        token.RevokedByIp = ipAddress;
                    }
                }

                await userManager.UpdateAsync(loggedInUser);

                await context.SaveChangesAsync();
                return loggedInUser;
            }
            else
            {
                return Result.NotFound<User>().With(Error.NotFound("User not found", user.UserName ?? ""));
            }
        }

        public async Task<Result<UserView>> GetLoggedInUser(string userId)
        {
            var user = await context.Users.Where(u => u.Id == userId && u.IsArchived == false).FirstOrDefaultAsync();
            var userRole = await context.UserRoles.Where(u => u.UserId == userId).FirstOrDefaultAsync();
            var role = new Role { };
            if (userRole != null)
            {
                role = await context.Roles.Where(r => r.Id == userRole.RoleId).FirstOrDefaultAsync();

            }
            if (user != null)
            {
                if (role != null)
                {
                    var userview = new UserView
                    {
                        userId = user.Id,
                        Email = user.Email ?? "",
                        FullName = user.FullName ?? "",
                        FirstName = user.FirstName ?? "",
                        LastName = user.LastName ?? "",
                        role = role.Name ?? ""
                    };
                    return userview;

                }
                else
                {
                    var userview = new UserView
                    {
                        userId = user.Id,
                        Email = user.Email ?? "",
                        FullName = user.FullName ?? "",
                        FirstName = user.FirstName ?? "",
                        LastName = user.LastName ?? "",
                        role = ""
                    };
                    return userview;
                }

            }
            else
            {
                return Result.NotFound<UserView>().With(Error.NotFound("User not found"));
            }
        }

        public async Task<Result<List<UserView>>> GetAllUsers()
        {
            var users = await context.Users.Where(u => u.IsArchived == false).ToListAsync();
            var usersView = new List<UserView>();
            foreach (var user in users)
            {
                if (user != null)
                {
                    var userview = new UserView

                    {
                        userId = user.Id,
                        Email = user.Email ?? "",
                        FullName = user.FullName ?? "",
                        FirstName = user.FirstName ?? "",
                        LastName = user.LastName ?? "",
                        role = ""
                    };

                    usersView.Add(userview);

                }
            }
            return usersView;
        }
    }
}