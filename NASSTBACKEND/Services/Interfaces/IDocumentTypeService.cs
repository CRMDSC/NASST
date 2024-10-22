using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data.InputModels;
using NASSTBACKEND.Data.ViewModels;

namespace NASSTBACKEND.Services.Interfaces
{
    public interface IDocumentTypeService
    {
        Task<Result<List<DocumentType>>> GetDocumentTypes();
        Task<Result<DocumentType>> AddDocumentType(DocumentType input);
        Task<Result<DocumentType>> GetDocumentTypeById(int id);
        Task<Result<bool>> DeleteDocumentType(int id);
        Task<Result<bool>> EditDocumentType(DocumentType input);

        

    }
}
