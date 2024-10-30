using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using NASSTBACKEND.Data.Entities;

namespace NASSTBACKEND.Data.ViewModels
{
    [DataContract]
    public class SportTypeView
    {
        [DataMember] public int Id { get; set; }
        [DataMember] public string? Name { get; set; }
        [DataMember] public int TeamsCount { get; set; }
        [DataMember] public string? TeamAdminId { get; set; }
        [DataMember] public User? TeamAdmin { get; set; }
        [DataMember] public DateTime RegistrationTime { get; set; }
        [DataMember] public DateTime ReplacementTime { get; set; }
        [DataMember] public List<SportPlayersCategory>? SportPlayersCategories { get; set; }
        [DataMember] public List<SportAdditionalInfo>? SportAdditionalInfo { get; set; }
        [DataMember] public List<SportDocumentType>? SportDocumentType { get; set; }

    }
}