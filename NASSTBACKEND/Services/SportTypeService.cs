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
using System.Security.Authentication;

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
                if(input.TeamAdminId == null || input.TeamAdminId == "")
                {
                   return Result.BadRequest<bool>().With(Error.InvalidParameter("Sport type admin cannot be empty."));
                }
                if(input.Name == null || input.Name == "")
                {
                     return Result.BadRequest<bool>().With(Error.InvalidParameter("Sport type title cannot be empty."));
                }
                var TeamAdmin = await context.Users.Where(u => u.Id == input.TeamAdminId).FirstOrDefaultAsync();
                var sportType = new SportType
                {
                    Name = input.Name,
                    MaxTeams = input.TeamsCount,
                    CreatedBy = user,
                    CreatedById = user.Id,
                    TeamAdmin = TeamAdmin,
                    TeamAdminId = input.TeamAdminId
                };
                await context.SportTypes.AddAsync(sportType);

                if (input.SportPlayersCategories != null)
                {
                    foreach (var cat in input.SportPlayersCategories)
                    {
                        var Category = await context.Category.Where(c => c.Id == cat.CategoryId).FirstOrDefaultAsync();
                        var sportsPlayersCategory = new SportPlayersCategory
                        {
                            Category = Category,
                            CategoryId = cat.CategoryId,
                            PlayersCount = cat.PlayersCount,
                            SportType = sportType,
                            SportTypeId = sportType.Id
                        };

                        await context.SportPlayersCategories.AddAsync(sportsPlayersCategory);
                    }

                }
                if (input.SportAdditionalInfo != null)
                {
                    foreach (var info in input.SportAdditionalInfo)
                    {
                        var Information = await context.AdditionalInformation.Where(i => i.Id == info.Id).FirstOrDefaultAsync();
                        var sportsPlayersInfo = new SportAdditionalInfo
                        {
                            AdditionalInformation = Information,
                            AdditionalInformationId = info.Id,
                            SportType = sportType,
                            SportTypeId = sportType.Id
                        };
                        await context.SportAdditionalInformation.AddAsync(sportsPlayersInfo);

                    }
                }

                if (input.SportDocumentType != null)
                {
                    foreach (var doc in input.SportDocumentType)
                    {
                        var DocumentType = await context.DocumentTypes.Where(d => d.Id == doc.Id).FirstOrDefaultAsync();
                        var sportDocs = new SportDocumentType
                        {
                            DocumentType = DocumentType,
                            DocumentTypeId = doc.Id,
                            SportType = sportType,
                            SportTypeId = sportType.Id
                        };
                        await context.SportDocumentTypes.AddAsync(sportDocs);
                    }

                }

                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return Result.BadRequest<bool>().With(Error.InvalidParameter("Something went wrong please contact your administrator."));
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
                sportType.MaxTeams = input.TeamsCount;

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
                    TeamsCount = s.MaxTeams
                };
                sportsTypeView.Add(newView);
            }
            return sportsTypeView;
        }

        public async Task<Result<SportTypeView>> GetSportTypeById(int id)
        {
            var sportType = await context.SportTypes.Where(s => s.Id == id && !s.IsArchived).Include(s => s.TeamAdmin).FirstOrDefaultAsync();
            var playersCategories = await context.SportPlayersCategories.Where(s => s.SportTypeId == sportType.Id).Include(s => s.Category).ToListAsync();
            var playersInformation = await context.SportAdditionalInformation.Where(s => s.SportTypeId == sportType.Id).Include(s => s.AdditionalInformation).ToListAsync();
            var playersDocs = await context.SportDocumentTypes.Where(s => s.SportTypeId == sportType.Id).Include(s => s.DocumentType).ToListAsync();

            var sportTypeView = new SportTypeView
            {
                Id = sportType.Id,
                Name = sportType.Name,
                TeamsCount = sportType.MaxTeams,
                RegistrationTime = sportType.RegistrationTime,
                ReplacementTime = sportType.ReplacementTime,
                TeamAdmin = sportType.TeamAdmin,
                SportAdditionalInfo = playersInformation,
                SportDocumentType = playersDocs,
                SportPlayersCategories = playersCategories,
                TeamAdminId = sportType.TeamAdminId
            };
            return sportTypeView;
        }
    }
}