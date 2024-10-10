using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using NASSTBACKEND.Services.Interfaces;
using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data;
using NASSTBACKEND.Data.ViewModels;
using NASSTBACKEND.Data.InputModels;
using NASSTBACKEND.Helpers;
using Microsoft.AspNetCore.Authorization;
using NASSTBACKEND.Options;

namespace NASSTBACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService accountService;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly NASSTContext context;
        private readonly AppConfiguration appConfig;

        private static SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);

        public AccountController(IOptions<AppConfiguration> appConfigSection, IAccountService accountService, UserManager<User> userManager, RoleManager<Role> roleManager, NASSTContext context)
        {
            this.accountService = accountService;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.context = context;
            this.appConfig = appConfigSection.Value;
        }


        [HttpPost("Login")]
        [Produces(typeof(Result<LoginView>))]
        public async Task<IActionResult> Login([FromBody] LoginInput input)
        {
            try
            {
                var loginResult = await accountService.Login(input, RequestInfoFetching.IpAddress(HttpContext, Request));
                if (loginResult.Succeeded)
                    RequestInfoFetching.SetTokenCookie(Response, loginResult.Payload.RefreshToken, loginResult.Payload.RefreshTokenExpiresIn);
                return loginResult.ToActionResult();
            }
            catch (Exception ex)
            {
                var user = await userManager.FindByEmailAsync(appConfig.AdminEmail);
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = user.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Failed to login with  " + input.Email + " | and exception: " + ex.Message,
                    StackTrace = ex.StackTrace,
                    Source = ex.Source,
                    Path = RequestInfoFetching.Path(Request),
                    Protocol = RequestInfoFetching.Protocol(Request),
                    Method = RequestInfoFetching.Method(Request),

                });
                await context.SaveChangesAsync();
                return Result.BadRequest<LoginView>()
                    .With(Error.BadRequest("An error occurred, please reach out to the system administrator.", path: RequestInfoFetching.Path(Request), time: DateTime.UtcNow))
                    .ToActionResult();
            }
        }
        [HttpPost("Register")]
        [Produces(typeof(Result<User>))]
        public async Task<IActionResult> Register([FromBody] RegisterInput input)
        {
            var user = await userManager.FindByEmailAsync(appConfig.AdminEmail);
            try
            {
                var result = await accountService.Register(input, user);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = user.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Failed to login with  " + input.Email + " | and exception: " + ex.Message,
                    StackTrace = ex.StackTrace,
                    Source = ex.Source,
                    Path = RequestInfoFetching.Path(Request),
                    Protocol = RequestInfoFetching.Protocol(Request),
                    Method = RequestInfoFetching.Method(Request),

                });
                await context.SaveChangesAsync();
                return Result.BadRequest<LoginView>()
                    .With(Error.BadRequest("An error occurred, please reach out to the system administrator.", path: RequestInfoFetching.Path(Request), time: DateTime.UtcNow))
                    .ToActionResult();
            }
        }
        [HttpPost("RefreshToken")]
        [Produces(typeof(Result<LoginView>))]
        public async Task<IActionResult> RefreshToken()
        {
            var user = await userManager.FindByEmailAsync(appConfig.AdminEmail);

            var refreshToken = Request.Cookies["refreshToken"];
            try
            {
                Result<LoginView> response = null;
                await semaphoreSlim.WaitAsync();
                try
                {
                    response = await accountService.RefreshToken(refreshToken, RequestInfoFetching.IpAddress(HttpContext, Request));
                }
                finally
                {
                    semaphoreSlim.Release();
                }
                if (response == null)
                    return Result.Unauthorized<LoginView>().With(Error.PermissionDenied(description: "Invalid token")).ToActionResult();
                if (response.Succeeded)
                    RequestInfoFetching.SetTokenCookie(Response, response.Payload.RefreshToken, response.Payload.RefreshTokenExpiresIn);

                return response.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = user.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Failed to create a refresh token ",
                    StackTrace = ex.StackTrace,
                    Source = ex.Source,
                    Path = RequestInfoFetching.Path(Request),
                    Protocol = RequestInfoFetching.Protocol(Request),
                    Method = RequestInfoFetching.Method(Request),

                });
                await context.SaveChangesAsync();
                return Result.BadRequest<LoginView>()
                    .With(Error.BadRequest("An error occurred, please reach out to the system administrator.", path: RequestInfoFetching.Path(Request), time: DateTime.UtcNow))
                    .ToActionResult();
            }
        }
        [Authorize("User")]
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var refreshToken = Request.Cookies["NASST.RefreshToken"];
                var result = await accountService.Logout(loggedInUser, RequestInfoFetching.IpAddress(HttpContext, Request), refreshToken);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Source = ex.Source,
                    Path = RequestInfoFetching.Path(Request),
                    Protocol = RequestInfoFetching.Protocol(Request),
                    Method = RequestInfoFetching.Method(Request),
                });
                await context.SaveChangesAsync();
                return Result.BadRequest<User>()
                    .With(Error.BadRequest("An error occurred, please reach out to the system administrator.", path: RequestInfoFetching.Path(Request), time: DateTime.UtcNow))
                    .ToActionResult();
            }
        }
        [Authorize("User")]
        [HttpGet]
        public async Task<IActionResult> GetLoggedInUser()
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await accountService.GetLoggedInUser(loggedInUser.Id);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Source = ex.Source,
                    Path = RequestInfoFetching.Path(Request),
                    Protocol = RequestInfoFetching.Protocol(Request),
                    Method = RequestInfoFetching.Method(Request),
                });
                await context.SaveChangesAsync();
                return Result.BadRequest<User>()
                    .With(Error.BadRequest("An error occurred, please reach out to the system administrator.", path: RequestInfoFetching.Path(Request), time: DateTime.UtcNow))
                    .ToActionResult();
            }
        }
    }
}