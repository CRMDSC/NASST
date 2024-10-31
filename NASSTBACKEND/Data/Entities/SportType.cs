namespace NASSTBACKEND.Data.Entities
{
     public class SportType 
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int MaxTeams { get; set; }
        public bool IsArchived { get; set; }
        public string? CreatedById { get; set; }
        public virtual User? CreatedBy { get; set; }
        public string? UpdatedById { get; set; }
        public virtual User? UpdatedBy { get; set; }
        public virtual User? TeamAdmin { get; set; }
        public string? TeamAdminId { get; set; }
        public DateTime RegistrationTime { get; set; }
        public DateTime ReplacementTime { get; set; }
        public string? LogoUrl { get; set; }

    }

}
