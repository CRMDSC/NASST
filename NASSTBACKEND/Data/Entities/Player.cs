using Microsoft.AspNetCore.Identity;
using NASSTBACKEND.Data.Entities;

namespace NASSTBACKEND.Data.Entities
{
    public class Player
    {

        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public int CategortId { get; set; }
        public virtual required Category Category { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public bool IsArchived { get; set; }
        public string? CreatedById { get; set; }
        public User? CreatedBy { get; set; }
        public string? UpdatedById { get; set; }
        public User? UpdatedBy { get; set; }
    }
}
