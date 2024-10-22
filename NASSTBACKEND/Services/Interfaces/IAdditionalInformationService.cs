using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data.InputModels;
using NASSTBACKEND.Data.ViewModels;

namespace NASSTBACKEND.Services.Interfaces
{
    public interface IAdditionalInformationService
    {
        Task<Result<List<AdditionalInformation>>> GetAdditionalInformation();
        Task<Result<AdditionalInformation>> AddAdditionalInformation(AdditionalInformation input);
        Task<Result<AdditionalInformation>> GetAdditionalInformationById(int id);
        Task<Result<bool>> DeleteAdditionalInformation(int id);
        Task<Result<bool>> EditAdditionalInformation(AdditionalInformation input);

        

    }
}
