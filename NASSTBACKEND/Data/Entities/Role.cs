using Microsoft.AspNetCore.Identity;
using System;

namespace NASSTBACKEND.Data.Entities
{
    public enum Roles
    {
        User,
        Admin
    }

    public class Role : IdentityRole
    {

        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? CreatedById { get; set; }
        public string? UpdatedById { get; set; }
        public bool IsArchived { get; set; }
        public virtual User? CreatedBy { get; set; }
        public virtual User? UpdatedBy { get; set; }
    }
}