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
    public class PlayerService : IPlayerService
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly RoleManager<Role> roleManager;
        private readonly NASSTContext context;

        public PlayerService(NASSTContext context, UserManager<User> userManager, SignInManager<User> signInManager, RoleManager<Role> roleManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.roleManager = roleManager;
            this.context = context;

        }

        public async Task<Result<Player>> CreatePlayer(PlayerInput input, User user)
        {
            var Category = await context.Category.Where(c => c.Id == input.CategoryId).FirstOrDefaultAsync();
            if (input.FirstName == "" || input.LastName == "" || input.Email == "" || input.PhoneNumber == "" || input.CategoryId == 0)
            {
                return Result.BadRequest<Player>().With(Error.InvalidParameter("Please fill all required fields"));
            }
            var newPlayer = new Player
            {
                FirstName = input.FirstName,
                LastName = input.LastName,
                Email = input.Email,
                PhoneNumber = input.PhoneNumber,
                CategortId = input.CategoryId,
                Category = Category,
                CreatedBy = user,
                CreatedById = user.Id,
                CreatedOn = DateTime.UtcNow,
            };
            await context.Players.AddAsync(newPlayer);
            await context.SaveChangesAsync();
            return newPlayer;
        }

        public async Task<Result<bool>> DeletePlayer(int id)
        {
            var player = await context.Players.Where(p => p.Id == id).FirstOrDefaultAsync();
            player.IsArchived = true;
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<Result<Player>> GetPlayerById(int id)
        {
            var player = await context.Players.Where(p => p.Id == id).FirstOrDefaultAsync();
            if (player == null)
            {
                return Result.BadRequest<Player>().With(Error.NotFound("Player not found."));
            }
            return player;
        }

        public async Task<Result<List<Player>>> GetPlayers()
        {
            var players = await context.Players.Where(p => p.IsArchived == false).Include(p => p.Category).ToListAsync();
            return players;
        }

        public async Task<Result<bool>> UpdatePlayer(EditPlayerInput player, User user)
        {
            var updatePlayer = await context.Players.Where(p => p.Id == player.Id).FirstOrDefaultAsync();
            if (updatePlayer == null)
            {
                return Result.BadRequest<bool>().With(Error.NotFound("Player not found."));
            }
            updatePlayer.FirstName = player.FirstName;
            updatePlayer.LastName = player.LastName;
            updatePlayer.Email = player.Email;
            updatePlayer.PhoneNumber = player.PhoneNumber;
            updatePlayer.CategortId = player.CategoryId;
            updatePlayer.Category = player.Category;
            updatePlayer.UpdatedBy = user;
            updatePlayer.UpdatedById = user.Id;
            updatePlayer.UpdatedOn = DateTime.UtcNow;

            await context.SaveChangesAsync();
            return true;

        }
    }
}