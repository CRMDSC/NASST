using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using NASSTBACKEND.Services.Interfaces;
using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data;
using NASSTBACKEND.Data.ViewModels;
using NASSTBACKEND.Helpers;
using Microsoft.AspNetCore.Authorization;
using NASSTBACKEND.Options;

namespace NASSTBACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdditionalInformationController : ControllerBase
    {
        private readonly IAdditionalInformationService additionalInformationService;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly NASSTContext context;
        private readonly AppConfiguration appConfig;

        public AdditionalInformationController(IOptions<AppConfiguration> appConfigSection, IAdditionalInformationService additionalInformationService, UserManager<User> userManager, RoleManager<Role> roleManager, NASSTContext context)
        {
            this.additionalInformationService = additionalInformationService;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.context = context;
            this.appConfig = appConfigSection.Value;
        }

        [Authorize("Admin")]
        [HttpPost("AddInformation")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> AddInformation([FromBody] AdditionalInformation input)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await additionalInformationService.AddAdditionalInformation(input);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to add additional information",
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
        [HttpGet("GetInformation")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> GetAdditionalInformation()
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await additionalInformationService.GetAdditionalInformation();
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to get categories",
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
        [HttpGet("GetInformation/{id}")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> GetInformation([FromRoute] int id)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await additionalInformationService.GetAdditionalInformationById(id);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to get information",
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
        [HttpPost("DeleteAdditionalInformation")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> DeleteAdditionalInformation([FromBody] int id)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await additionalInformationService.DeleteAdditionalInformation(id);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to delete information",
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
        [HttpPost("UpdateAdditionalInformation")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> UpdateAdditionalInformation([FromBody] AdditionalInformation input)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await additionalInformationService.EditAdditionalInformation(input);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to update information",
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