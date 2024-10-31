namespace NASSTBACKEND.Data.Entities
{
    public class SportAdditionalInfo
    {
        public int Id { get; set; }
        public virtual required AdditionalInformation AdditionalInformation { get; set;}
        public int AdditionalInformationId { get; set; }
        public virtual required SportType SportType { get; set; }
        public int SportTypeId { get; set; }
        public bool IsArchived { get; set; }
    }

}
