namespace NASSTBACKEND.Data.Entities
{
    public class SportPlayersCategory
    {
        public int Id { get; set; }
        public virtual Category? Category { get; set;}
        public int CategoryId { get; set; }
        public virtual SportType? SportType { get; set; }
        public int SportTypeId { get; set; }
        public int PlayersCount { get; set; }
        public bool IsArchived { get; set; }
    }

}
