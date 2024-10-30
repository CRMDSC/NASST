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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService categoryService;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly NASSTContext context;
        private readonly AppConfiguration appConfig;

        public CategoryController(IOptions<AppConfiguration> appConfigSection, ICategoryService categoryService, UserManager<User> userManager, RoleManager<Role> roleManager, NASSTContext context)
        {
            this.categoryService = categoryService;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.context = context;
            this.appConfig = appConfigSection.Value;
        }

        [Authorize("Admin")]
        [HttpPost("AddCategory")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> AddCategory([FromBody] Category input)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await categoryService.AddCategory(input);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser == null ? "" : loggedInUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Message = "Faild to add category",
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
        [HttpGet("GetCategories")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> GetCategories()
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await categoryService.GetCategories();
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser == null ? "" : loggedInUser.Id,
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
        [HttpGet("GetCategory/{id}")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> GetCategory([FromRoute] int id)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await categoryService.GetCategory(id);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser == null ? "" : loggedInUser.Id,
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
        [HttpPost("DeleteCategory")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> DeleteCategory([FromBody] int id)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await categoryService.DeleteCategory(id);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser == null ? "" : loggedInUser.Id,
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
        [HttpPost("UpdateCategory")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> UpdateCategory([FromBody] Category input)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await categoryService.EditCategory(input);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser == null ? "" : loggedInUser.Id,
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
    }
}