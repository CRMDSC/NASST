namespace NASSTBACKEND.Data.Entities
{
     public class SportType 
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int PlayersCount { get; set; }
        public int TeamsCount { get; set; }
        public bool IsArchived { get; set; }
        public string? CreatedById { get; set; }
        public User CreatedBy { get; set; }
        public string? UpdatedById { get; set; }
        public User UpdatedBy { get; set; }

    }

}
