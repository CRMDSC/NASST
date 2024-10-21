using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data.InputModels;
using NASSTBACKEND.Data.ViewModels;

namespace NASSTBACKEND.Services.Interfaces
{
    public interface IPlayerService
    {
        Task<Result<Player>> CreatePlayer(PlayerInput input, User user);
        Task<Result<List<Player>>> GetPlayers();
        Task<Result<Player>> GetPlayerById(int id);
        Task<Result<bool>> DeletePlayer(int id);
        Task<Result<bool>> UpdatePlayer(Player player, User user);

    }
}
