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
    public class SportTypeService : ISportTypeService
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly RoleManager<Role> roleManager;
        private readonly NASSTContext context;
        private readonly Security securityOptions;
        private readonly AppConfiguration appConfig;

        public SportTypeService(IOptions<AppConfiguration> appConfigSection, NASSTContext context, UserManager<User> userManager, SignInManager<User> signInManager, RoleManager<Role> roleManager, IConfiguration configuration,
        IOptions<Security> securityOptions)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.roleManager = roleManager;
            this.securityOptions = securityOptions.Value;
            this.context = context;
            this.appConfig = appConfigSection.Value;

        }

        public async Task<Result<bool>> AddSportType(SportTypeInput input, User user)
        {
            try
            {
                var sportType = new SportType
                {
                    Name = input.Name,
                    PlayersCount = input.PlayersCount,
                    TeamsCount = input.TeamsCount,
                    CreatedBy = user,
                    CreatedById = user.Id
                };
                await context.SportTypes.AddAsync(sportType);
                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<Result<bool>> DeleteSportType(int id)
        {
            var sportType = await context.SportTypes.Where(s => s.Id == id).FirstOrDefaultAsync();
            sportType.IsArchived = true;
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<Result<bool>> EditSportType(UpdateSportTypeInput input, User user)
        {
            try
            {
                var sportType = await context.SportTypes.Where(s => s.Id == input.Id && !s.IsArchived).FirstOrDefaultAsync();
                sportType.Name = input.Name;
                sportType.PlayersCount = input.PlayersCount;
                sportType.TeamsCount = input.TeamsCount;

                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<Result<List<SportTypeView>>> GetSportsTypes()
        {
            var sportsType = await context.SportTypes.Where(s => s.IsArchived == false).ToListAsync();
            var sportsTypeView = new List<SportTypeView>();
            foreach (var s in sportsType)
            {
                var newView = new SportTypeView
                {
                    Id = s.Id,
                    Name = s.Name,
                    PlayersCount = s.PlayersCount,
                    TeamsCount = s.TeamsCount
                };
                sportsTypeView.Add(newView);
            }
            return sportsTypeView;
        }

        public async Task<Result<SportTypeView>> GetSportTypeById(int id)
        {
            var sportType = await context.SportTypes.Where(s => s.Id == id && !s.IsArchived).FirstOrDefaultAsync();
            var sportTypeView = new SportTypeView
            {
                Id = sportType.Id,
                Name = sportType.Name,
                PlayersCount = sportType.PlayersCount,
                TeamsCount = sportType.TeamsCount
            };
            return sportTypeView;
        }
    }
}