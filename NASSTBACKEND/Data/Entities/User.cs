using Microsoft.AspNetCore.Identity;
using NASSTBACKEND.Data.Entities;

namespace NASSTBACKEND.Data.Entities
{
    public class User : IdentityUser
    {

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? FCMToken { get; set; }
        public bool IsArchived { get; set; }
        public string? CreatedById { get; set; }
        public User? CreatedBy { get; set; }
        public string? UpdatedById { get; set; }
        public User? UpdatedBy { get; set; }
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
