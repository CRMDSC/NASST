namespace NASSTBACKEND.Data.Entities
{
    public class AdditionalInformation
    {
        public int Id { get; set; }
        public required string  Name { get; set; }
        public bool IsArchived { get; set; }
    }

}
