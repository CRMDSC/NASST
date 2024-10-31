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
    public class SportTypeController : ControllerBase
    {
        private readonly ISportTypeService sportTypeService;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly NASSTContext context;
        private readonly AppConfiguration appConfig;

        public SportTypeController(IOptions<AppConfiguration> appConfigSection, ISportTypeService sportTypeService, UserManager<User> userManager, RoleManager<Role> roleManager, NASSTContext context)
        {
            this.sportTypeService = sportTypeService;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.context = context;
            this.appConfig = appConfigSection.Value;
        }

        [Authorize("Admin")]
        [HttpPost("AddSportType")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> AddSportType([FromForm] SportTypeInput input)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                if (loggedInUser != null)
                {
                    var result = await sportTypeService.AddSportType(input, loggedInUser);
                    return result.ToActionResult();
                }
                else
                {
                    return Result.BadRequest<LoginView>()
                    .With(Error.BadRequest("An error occurred, please reach out to the system administrator.", path: RequestInfoFetching.Path(Request), time: DateTime.UtcNow))
                    .ToActionResult();
                }
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser == null ? "" : loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to add sport type",
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
        [Authorize("Admin")]
        [HttpPost("UpdateSportType")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> UpdateSportType([FromForm] UpdateSportTypeInput input)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                if (loggedInUser != null)
                {
                    var result = await sportTypeService.EditSportType(input);
                    return result.ToActionResult();
                }
                else
                {
                    return Result.BadRequest<LoginView>()
                    .With(Error.BadRequest("An error occurred, please reach out to the system administrator.", path: RequestInfoFetching.Path(Request), time: DateTime.UtcNow))
                    .ToActionResult();
                }
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser == null ? "" : loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to update sport type",
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
        [Authorize("Admin")]
        [HttpGet("GetAllSportsType")]
        [Produces(typeof(Result<SportTypeView[]>))]
        public async Task<IActionResult> GetAllSportsType()
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await sportTypeService.GetSportsTypes();
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser == null ? "" : loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to get all sports types",
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
        [Authorize("Admin")]
        [HttpGet("GetSportType/{id}")]
        [Produces(typeof(Result<SportTypeView>))]
        public async Task<IActionResult> GetSportType([FromRoute] int id)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await sportTypeService.GetSportTypeById(id);

                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser == null ? "" : loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Failed to get sport type",
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
        [Authorize("Admin")]
        [HttpPost("DeleteSportType/{id}")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> DeleteSportType([FromRoute] int id)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await sportTypeService.DeleteSportType(id);

                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                   CreatedById = loggedInUser == null ? "" : loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Failed to delete sport type",
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
    }
}