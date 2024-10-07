namespace NASSTBACKEND.Data.Entities
{
     public class Log 
    {
        public int Id { get; set; }
        public string? Message { get; set; }
        public string? StackTrace { get; set; }
        public string? Source { get; set; }
        public string? Path { get; set; }
        public string? Protocol { get; set; }
        public string? Method { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? CreatedById { get; set; }
        public User? CreatedByUser { get; set; }
    }

}
