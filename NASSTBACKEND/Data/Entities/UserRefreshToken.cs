using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;


namespace NASSTBACKEND.Data.Entities
{
    public class UserRefreshToken
    {
        public int Id { get; set; }
        [StringLength(70)]
        public string Token { get; set; }
        public DateTime? Expires { get; set; }
        public bool IsExpired => Expires != null ? DateTime.UtcNow >= Expires : false;
        public DateTime Created { get; set; }
        [StringLength(30)]
        public string? CreatedByIp { get; set; }
        public DateTime? Revoked { get; set; }
        [StringLength(30)]
        public string? RevokedByIp { get; set; }
        [StringLength(70)]
        public string? ReplacedByToken { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
        public string UserId { get; set; }
        public virtual User User { get; set; }
    }
}