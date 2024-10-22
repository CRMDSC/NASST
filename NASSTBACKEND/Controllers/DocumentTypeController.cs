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
    public class DocumentTypeController : ControllerBase
    {
        private readonly IDocumentTypeService documentTypeService;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly NASSTContext context;
        private readonly AppConfiguration appConfig;

        public DocumentTypeController(IOptions<AppConfiguration> appConfigSection, IDocumentTypeService documentTypeService, UserManager<User> userManager, RoleManager<Role> roleManager, NASSTContext context)
        {
            this.documentTypeService = documentTypeService;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.context = context;
            this.appConfig = appConfigSection.Value;
        }

        [Authorize("Admin")]
        [HttpPost("AddDocumentType")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> AddDocumentType([FromBody] DocumentType input)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await documentTypeService.AddDocumentType(input);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to add document type",
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
        [HttpGet("GetDocumentType")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> GetDocumentType()
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await documentTypeService.GetDocumentTypes();
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to get document types",
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
        [HttpGet("GetDocument/{id}")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> GetDocument([FromRoute] int id)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await documentTypeService.GetDocumentTypeById(id);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to get document type",
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
        [HttpPost("DeleteDocumentType")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> DeleteDocumentType([FromBody] int id)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await documentTypeService.DeleteDocumentType(id);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to delete document type",
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
        [HttpPost("UpdateDocumentType")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> UpdateDocumentType([FromBody] DocumentType input)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await documentTypeService.EditDocumentType(input);
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