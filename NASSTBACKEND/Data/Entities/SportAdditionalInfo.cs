namespace NASSTBACKEND.Data.Entities
{
    public class SportAdditionalInfo
    {
        public int Id { get; set; }
        public virtual AdditionalInformation AdditionalInformation { get; set;}
        public int AdditionalInformationId { get; set; }
        public string InformationValue { get; set; }
        public virtual SportType SportType { get; set; }
        public int SportTypeId { get; set; }
    }

}
