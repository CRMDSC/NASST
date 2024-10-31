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
using Microsoft.CodeAnalysis.CSharp.Syntax;

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
                if (input.TeamAdminId == null || input.TeamAdminId == "")
                {
                    return Result.BadRequest<bool>().With(Error.InvalidParameter("Sport type admin cannot be empty."));
                }
                if (input.Name == null || input.Name == "")
                {
                    return Result.BadRequest<bool>().With(Error.InvalidParameter("Sport type title cannot be empty."));
                }
                var TeamAdmin = await context.Users.Where(u => u.Id == input.TeamAdminId).FirstOrDefaultAsync();
                string? logoUrl = null;
                if (input.Logo != null)
                {
                    var filePath = Path.Combine("wwwroot/images/logos", $"{Guid.NewGuid()}_{input.Logo.FileName}");
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await input.Logo.CopyToAsync(stream);
                    }
                    logoUrl = $"/images/logos/{Path.GetFileName(filePath)}";
                }
                var sportType = new SportType
                {
                    Name = input.Name,
                    MaxTeams = input.TeamsCount,
                    CreatedBy = user,
                    CreatedById = user.Id,
                    TeamAdmin = TeamAdmin,
                    TeamAdminId = input.TeamAdminId,
                    LogoUrl = logoUrl,
                    RegistrationTime = input.RegistrationTime,
                    ReplacementTime = input.ReplacementTime
                };
                await context.SportTypes.AddAsync(sportType);

                if (input.SportPlayersCategories != null)
                {
                    foreach (var cat in input.SportPlayersCategories)
                    {
                        var Category = await context.Category.Where(c => c.Id == cat.CategoryId && !c.IsArchived).FirstOrDefaultAsync();
                        if (Category != null)
                        {
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

                }
                if (input.SportAdditionalInfo != null)
                {
                    foreach (var info in input.SportAdditionalInfo)
                    {
                        var Information = await context.AdditionalInformation.Where(i => i.Id == info.Id && !i.IsArchived).FirstOrDefaultAsync();
                        if (Information != null)
                        {
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
                }

                if (input.SportDocumentType != null)
                {
                    foreach (var doc in input.SportDocumentType)
                    {
                        var DocumentType = await context.DocumentTypes.Where(d => d.Id == doc.Id && !d.IsArchived).FirstOrDefaultAsync();
                        if (DocumentType != null)
                        {
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

                }

                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Result.BadRequest<bool>().With(Error.InvalidParameter("Something went wrong please contact your administrator."));
            }

        }

        public async Task<Result<bool>> DeleteSportType(int id)
        {
            var sportType = await context.SportTypes.Where(s => s.Id == id).FirstOrDefaultAsync();
            if (sportType != null)
            {
                sportType.IsArchived = true;
            }
            var sportDocs = await context.SportDocumentTypes.Where(s => s.SportTypeId == id).ToListAsync();
            foreach (var doc in sportDocs)
            {
                doc.IsArchived = true;
            }
            var sportInfo = await context.SportAdditionalInformation.Where(s => s.SportTypeId == id).ToListAsync();
            foreach (var info in sportInfo)
            {
                info.IsArchived = true;
            }
            var sportsPlayersCategory = await context.SportPlayersCategories.Where(s => s.SportTypeId == id).ToListAsync();
            foreach (var cat in sportsPlayersCategory)
            {
                cat.IsArchived = true;
            }
            await context.SaveChangesAsync();
            return true;
        }
        public async Task<Result<bool>> EditSportType(UpdateSportTypeInput input)
        {
            try
            {
                var sportType = await context.SportTypes.Where(s => s.Id == input.Id && !s.IsArchived).FirstOrDefaultAsync();
                var TeamAdmin = await context.Users.Where(u => u.Id == input.TeamAdminId).FirstOrDefaultAsync();

                if (sportType == null)
                {
                    return Result.BadRequest<bool>().With(Error.InvalidParameter("Sport type not found."));
                }
                string? logoUrl = sportType.LogoUrl;
                if (input.Logo != null)
                {
                    var filePath = Path.Combine("wwwroot/images/logos", $"{Guid.NewGuid()}_{input.Logo.FileName}");
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await input.Logo.CopyToAsync(stream);
                    }
                    logoUrl = $"/images/logos/{Path.GetFileName(filePath)}";
                    if(sportType.LogoUrl != null)
                    {
                        string logoPathToDelete = Path.Combine("wwwroot", sportType.LogoUrl.TrimStart('/').Replace('/', '\\'));

                        if (System.IO.File.Exists(logoPathToDelete))
                        {
                            System.IO.File.Delete(logoPathToDelete);
                        }
                    }
                }

#pragma warning disable CS8601 // Possible null reference assignment.
                sportType.Name = input.Name;
#pragma warning restore CS8601 // Possible null reference assignment.
                sportType.MaxTeams = input.TeamsCount;
                sportType.TeamAdmin = TeamAdmin;
                sportType.TeamAdminId = input.TeamAdminId;
                sportType.RegistrationTime = input.RegistrationTime;
                sportType.ReplacementTime = input.ReplacementTime;
                sportType.LogoUrl = logoUrl;

                if (input.SportAdditionalInfo != null)
                {
                    var existingAdditionalInfo = await context.SportAdditionalInformation.Where(s => s.SportTypeId == sportType.Id && !s.IsArchived).ToListAsync();
                    foreach (var existingInfo in existingAdditionalInfo)
                    {
                        context.SportAdditionalInformation.Remove(existingInfo);
                    }
                    foreach (var addInfo in input.SportAdditionalInfo)
                    {
                        var information = await context.AdditionalInformation.Where(a => a.Id == addInfo.Id && !a.IsArchived).FirstOrDefaultAsync();
                        if (information != null)
                        {
                            var newSportAdditionalInfo = new SportAdditionalInfo
                            {
                                AdditionalInformation = information,
                                AdditionalInformationId = information.Id,
                                SportTypeId = sportType.Id,
                                SportType = sportType
                            };
                            await context.SportAdditionalInformation.AddAsync(newSportAdditionalInfo);
                        }
                    }
                }

                if (input.SportDocumentType != null)
                {
                    var existingDocs = await context.SportDocumentTypes.Where(s => s.SportTypeId == sportType.Id && !s.IsArchived).ToListAsync();
                    foreach (var existingInfo in existingDocs)
                    {
                        context.SportDocumentTypes.Remove(existingInfo);
                    }
                    foreach (var doc in input.SportDocumentType)
                    {
                        var newDoc = await context.DocumentTypes.Where(d => d.Id == doc.Id && !d.IsArchived).FirstOrDefaultAsync();
                        if (newDoc != null)
                        {
                            var newSportDocument = new SportDocumentType
                            {
                                DocumentType = newDoc,
                                DocumentTypeId = newDoc.Id,
                                IsArchived = false,
                                SportType = sportType,
                                SportTypeId = sportType.Id
                            };
                            await context.SportDocumentTypes.AddAsync(newSportDocument);

                        }
                    }
                }

                if (input.SportPlayersCategories != null)
                {
                    var existingCategories = await context.SportPlayersCategories.Where(p => p.SportTypeId == sportType.Id && !p.IsArchived).ToListAsync();
                    foreach (var existingInfo in existingCategories)
                    {
                        context.SportPlayersCategories.Remove(existingInfo);
                    }
                    foreach (var cat in input.SportPlayersCategories)
                    {
                        var category = await context.Category.Where(c => c.Id == cat.CategoryId && !c.IsArchived).FirstOrDefaultAsync();

                        if (category != null)
                        {
                            var sportsPlayersCategory = new SportPlayersCategory
                            {
                                Category = category,
                                CategoryId = cat.CategoryId,
                                PlayersCount = cat.PlayersCount,
                                SportTypeId = sportType.Id,
                                SportType = sportType
                            };
                            await context.SportPlayersCategories.AddAsync(sportsPlayersCategory);
                        }
                    }
                }


                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Result.BadRequest<bool>().With(Error.InvalidParameter("Something went wrong, please contact the administrator."));
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
                    TeamsCount = s.MaxTeams,
                    LogoUrl = s.LogoUrl
                };
                sportsTypeView.Add(newView);
            }
            return sportsTypeView;
        }

        public async Task<Result<SportTypeView>> GetSportTypeById(int id)
        {
            var sportType = await context.SportTypes.Where(s => s.Id == id && !s.IsArchived).Include(s => s.TeamAdmin).FirstOrDefaultAsync();
            if (sportType != null)
            {
                var playersCategories = await context.SportPlayersCategories.Where(s => s.SportTypeId == sportType.Id).Include(s => s.Category).ToListAsync();
                var playersInformation = await context.SportAdditionalInformation.Where(s => s.SportTypeId == sportType.Id).Include(s => s.AdditionalInformation).ToListAsync();
                var playersDocs = await context.SportDocumentTypes.Where(s => s.SportTypeId == sportType.Id).Include(s => s.DocumentType).ToListAsync();

                string logoFilePath = null;
                string logoBase64 = null;

                if (sportType.LogoUrl != null)
                {
                    logoFilePath = Path.Combine("", "wwwroot" + sportType.LogoUrl);

                    if (System.IO.File.Exists(logoFilePath))
                    {
                        byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(logoFilePath);
                        logoBase64 = Convert.ToBase64String(fileBytes);
                    }

                }

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
                    TeamAdminId = sportType.TeamAdminId,
                    LogoUrl = sportType.LogoUrl,
                    Logo = logoBase64
                };
                return sportTypeView;

            }
            return Result.BadRequest<SportTypeView>().With(Error.InvalidParameter("Something went wrong, please contact the administrator."));
        }
    }
}