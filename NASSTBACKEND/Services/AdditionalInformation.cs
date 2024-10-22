using Microsoft.EntityFrameworkCore;
using NASSTBACKEND.Services.Interfaces;
using NASSTBACKEND.Data.ViewModels;
using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data;

namespace NASSTBACKEND.Services.General
{
    public class AdditionalInformationService : IAdditionalInformationService
    {
        private readonly NASSTContext context;

        public AdditionalInformationService(NASSTContext context)
        {
            this.context = context;
        }

        public async Task<Result<AdditionalInformation>> AddAdditionalInformation(AdditionalInformation input)
        {
            var infos = await context.AdditionalInformation.Where(a => a.IsArchived == false).ToListAsync();
            if (input.Name == null || input.Name == "")
            {
                return Result.BadRequest<AdditionalInformation>().With(Error.InvalidParameter("Information title cannot be null"));
            }
            foreach (var i in infos)
            {
                if (i.Name.ToLower() == input.Name.ToLower())
                {
                    return Result.BadRequest<AdditionalInformation>().With(Error.NotAcceptable("Information type already exists"));
                }
            }
            var info = new AdditionalInformation
            {
                Name = input.Name
            };
            await context.AdditionalInformation.AddAsync(info);
            await context.SaveChangesAsync();
            return info;
        }

        public async Task<Result<bool>> DeleteAdditionalInformation(int id)
        {
            var info = await context.AdditionalInformation.Where(i => i.Id == id).FirstOrDefaultAsync();
            info.IsArchived = true;
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<Result<bool>> EditAdditionalInformation(AdditionalInformation input)
        {
            var info = await context.AdditionalInformation.Where(c => c.Id == input.Id).FirstOrDefaultAsync();
            info.Name = input.Name;
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<Result<List<AdditionalInformation>>> GetAdditionalInformation()
        {
            var infos = await context.AdditionalInformation.Where(c => c.IsArchived == false).ToListAsync();
            return infos;
        }

        public async Task<Result<AdditionalInformation>> GetAdditionalInformationById(int id)
        {
           var info = await context.AdditionalInformation.Where(c => c.Id == id).FirstOrDefaultAsync();
            return info;
        }
    }
}