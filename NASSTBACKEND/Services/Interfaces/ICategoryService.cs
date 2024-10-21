using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data.InputModels;
using NASSTBACKEND.Data.ViewModels;

namespace NASSTBACKEND.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<List<Category>>> GetCategories();
        Task<Result<Category>> AddCategory(Category input);
        Task<Result<Category>> GetCategory(int id);
        Task<Result<bool>> DeleteCategory(int id);
        Task<Result<bool>> EditCategory(Category input);

        

    }
}
