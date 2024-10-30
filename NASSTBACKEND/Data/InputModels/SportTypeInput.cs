using System;
using System.Runtime.Serialization;
using NASSTBACKEND.Data.Entities;

namespace NASSTBACKEND.Data.InputModels
{
  [DataContract]
  public class SportTypeInput
  {
    [DataMember] public string Name { get; set; }
    [DataMember] public int TeamsCount { get; set; }
    [DataMember] public string? TeamAdminId { get; set; }
    [DataMember] public DateTime RegistrationTime { get; set; }
    [DataMember] public DateTime ReplacementTime { get; set; }
    [DataMember] public List<SportPlayersCategory> SportPlayersCategories { get; set; }
    [DataMember] public List<AdditionalInformation> SportAdditionalInfo { get; set; }
    [DataMember] public List<DocumentType> SportDocumentType { get; set; }
  }
}