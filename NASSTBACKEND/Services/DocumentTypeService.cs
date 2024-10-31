using Microsoft.EntityFrameworkCore;
using NASSTBACKEND.Services.Interfaces;
using NASSTBACKEND.Data.ViewModels;
using NASSTBACKEND.Data.Entities;
using NASSTBACKEND.Data;

namespace NASSTBACKEND.Services.General
{
    public class DocumentTypeService : IDocumentTypeService
    {
        private readonly NASSTContext context;

        public DocumentTypeService(NASSTContext context)
        {
            this.context = context;
        }

        public async Task<Result<DocumentType>> AddDocumentType(DocumentType input)
        {
            var docs = await context.DocumentTypes.Where(d => d.IsArchived == false).ToListAsync();
            if (input.Type == null || input.Type == "")
            {
                return Result.BadRequest<DocumentType>().With(Error.InvalidParameter("Document type cannot be null"));
            }
            foreach (var i in docs)
            {
                if (i.Type.ToLower() == input.Type.ToLower())
                {
                    return Result.BadRequest<DocumentType>().With(Error.NotAcceptable("Document type already exists"));
                }
            }
            var doc = new DocumentType
            {
                Type = input.Type
            };
            await context.DocumentTypes.AddAsync(doc);
            await context.SaveChangesAsync();
            return doc;
        }

        public async Task<Result<bool>> DeleteDocumentType(int id)
        {
            var docType = await context.DocumentTypes.Where(i => i.Id == id).FirstOrDefaultAsync();
            if (docType != null)
            {
                docType.IsArchived = true;
                await context.SaveChangesAsync();
                return Result.Ok<bool>();
            }
            else
            {
                return Result.BadRequest<bool>().With(Error.NotAcceptable("Something went wrong, please contact the administrator."));
            }
        }

        public async Task<Result<bool>> EditDocumentType(DocumentType input)
        {
            var doc = await context.DocumentTypes.Where(c => c.Id == input.Id).FirstOrDefaultAsync();
            if (doc != null)
            {
                doc.Type = input.Type;
                await context.SaveChangesAsync();
                return Result.Ok<bool>();
            }
            else
            {
                return Result.BadRequest<bool>().With(Error.NotAcceptable("Something went wrong, please contact the administrator."));
            }
        }

        public async Task<Result<DocumentType>> GetDocumentTypeById(int id)
        {
            var info = await context.DocumentTypes.Where(c => c.Id == id).FirstOrDefaultAsync();
            if (info != null)
            {
                return info;
            }
            else
            {
                return Result.BadRequest<DocumentType>().With(Error.NotAcceptable("Something went wrong, please contact the administrator."));
            }
        }

        public async Task<Result<List<DocumentType>>> GetDocumentTypes()
        {
            var docs = await context.DocumentTypes.Where(c => c.IsArchived == false).ToListAsync();
            return docs;
        }
    }
}