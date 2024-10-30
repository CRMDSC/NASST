namespace NASSTBACKEND.Data.Entities
{
    public class DocumentType
    {
        public int Id { get; set; }
        public required string Type { get; set; }
        public bool IsArchived { get; set; }
    }

}
