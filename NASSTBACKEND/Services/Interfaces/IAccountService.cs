using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data.InputModels;
using NASSTBACKEND.Data.ViewModels;

namespace NASSTBACKEND.Services.Interfaces
{
    public interface IAccountService
    {
        Task<Result<LoginView>> Login(LoginInput input, string ipAddress);
        Task<Result<User>> Register(RegisterInput input, User user);
        Task<Result<User>> Logout(User user, string ipAddress, string refreshToken = "");
        Task<Result<LoginView>> RefreshToken(string token, string ipAddress);
        Task<Result<UserView>> GetLoggedInUser (string userId);
    }
}
