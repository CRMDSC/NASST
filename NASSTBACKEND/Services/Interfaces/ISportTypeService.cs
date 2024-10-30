using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data.InputModels;
using NASSTBACKEND.Data.ViewModels;

namespace NASSTBACKEND.Services.Interfaces
{
    public interface ISportTypeService
    {
        Task<Result<bool>> AddSportType(SportTypeInput input, User user);
        Task<Result<List<SportTypeView>>> GetSportsTypes();
        Task<Result<SportTypeView>> GetSportTypeById(int id);
        Task<Result<bool>> EditSportType(UpdateSportTypeInput input);
        Task<Result<bool>> DeleteSportType(int id);


    }
}
