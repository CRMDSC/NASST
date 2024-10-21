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
    public class PlayerController : ControllerBase
    {
        private readonly IPlayerService playerService;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly NASSTContext context;
        private readonly AppConfiguration appConfig;

        public PlayerController(IOptions<AppConfiguration> appConfigSection, IPlayerService playerService, UserManager<User> userManager, RoleManager<Role> roleManager, NASSTContext context)
        {
            this.playerService = playerService;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.context = context;
            this.appConfig = appConfigSection.Value;
        }

        [Authorize("Admin")]
        [HttpPost("AddPlayer")]
        [Produces(typeof(Result<Player>))]
        public async Task<IActionResult> AddPlayer([FromBody] PlayerInput input)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await playerService.CreatePlayer(input, loggedInUser);
                return result.ToActionResult();
            }
            catch (Exception ex)
            {
                await context.Logs.AddAsync(new Log
                {
                    CreatedById = loggedInUser.Id,
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
        [HttpGet("GetPlayers")]
        [Produces(typeof(Result<List<Player>>))]
        public async Task<IActionResult> GetPlayers()
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await playerService.GetPlayers();
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
        [HttpGet("GetPlayer/{id}")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> GetPlayer([FromRoute] int id)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await playerService.GetPlayerById(id);
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
        [HttpPost("DeletePlayer")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> DeletePlayer([FromBody] int id)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await playerService.DeletePlayer(id);
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
        [HttpPost("UpdatePlayer")]
        [Produces(typeof(Result<bool>))]
        public async Task<IActionResult> UpdatePlayer([FromBody] Player input)
        {
            var loggedInUser = await userManager.GetUserAsync(User);
            try
            {
                var result = await playerService.UpdatePlayer(input, loggedInUser);
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
    }
}