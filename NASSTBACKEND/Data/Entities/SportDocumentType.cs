namespace NASSTBACKEND.Data.Entities
{
    public class SportDocumentType
    {
        public int Id { get; set; }
        public virtual DocumentType? DocumentType { get; set;}
        public int DocumentTypeId { get; set; }
        public virtual SportType? SportType { get; set; }
        public int SportTypeId { get; set; }
         public bool IsArchived { get; set; }
    }

}
