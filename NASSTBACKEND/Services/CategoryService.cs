using Microsoft.EntityFrameworkCore;
using NASSTBACKEND.Services.Interfaces;
using NASSTBACKEND.Data.ViewModels;
using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data;


namespace NASSTBACKEND.Services.General
{
    public class CategoryService : ICategoryService
    {
        private readonly NASSTContext context;

        public CategoryService(NASSTContext context)
        {
            this.context = context;
        }

        public async Task<Result<Category>> AddCategory(Category input)
        {
            var categories = await context.Category.Where(c => c.IsArchived == false).ToListAsync();
            if (input.Name == null || input.Name == "")
            {
                return Result.BadRequest<Category>().With(Error.InvalidParameter("Category name cannot be null"));
            }
            foreach (var c in categories)
            {
                if (c.Name.ToLower() == input.Name.ToLower())
                {
                    return Result.BadRequest<Category>().With(Error.NotAcceptable("Category already exists"));
                }
            }
            var category = new Category
            {
                Name = input.Name
            };
            await context.Category.AddAsync(category);
            await context.SaveChangesAsync();
            return category;
        }

        public async Task<Result<bool>> DeleteCategory(int id)
        {
            var category = await context.Category.Where(c => c.Id == id).FirstOrDefaultAsync();
            if (category != null)
            {
                category.IsArchived = true;
                await context.SaveChangesAsync();
                return Result.Ok<bool>();
            }
            else
            {
                return Result.BadRequest<bool>().With(Error.NotAcceptable("Something went wrong, please contact the administrator."));
            }
        }

        public async Task<Result<bool>> EditCategory(Category input)
        {
            var category = await context.Category.Where(c => c.Id == input.Id).FirstOrDefaultAsync();
            if (category != null)
            {
                category.Name = input.Name;
                await context.SaveChangesAsync();
                return Result.Ok<bool>();
            }
            else
            {
                return Result.BadRequest<bool>().With(Error.NotAcceptable("Something went wrong, please contact the administrator."));
            }
        }

        public async Task<Result<List<Category>>> GetCategories()
        {
            var categories = await context.Category.Where(c => c.IsArchived == false).ToListAsync();
            return categories;
        }
        public async Task<Result<Category>> GetCategory(int id)
        {
            var category = await context.Category.Where(c => c.Id == id).FirstOrDefaultAsync();
            if (category != null)
            {
                return category;
            }
            else
            {
                return Result.BadRequest<Category>().With(Error.NotAcceptable("Something went wrong, please contact the administrator."));
            }
        }
    }
}