using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using NASSTBACKEND.Data.Entities;

namespace NASSTBACKEND.Data.ViewModels
{
    [DataContract]
    public class UserView
    {
        [DataMember] public string? userId { get; set; }
        [DataMember] public string? FullName { get; set; }
        [DataMember] public string? FirstName { get; set; }
        [DataMember] public string? LastName { get; set; }
        [DataMember] public string? Email { get; set; }
        [DataMember] public string? role { get; set; }
    }
}