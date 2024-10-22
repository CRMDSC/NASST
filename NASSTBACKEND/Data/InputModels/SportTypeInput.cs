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
    [DataMember] public int AdditionalInformationId { get; set; }
    [DataMember] public string InformationValue { get; set; }
   [DataMember] public List<SportPlayersCategory> SportPlayersCategories { get; set; }
    [DataMember] public int DocumentTypeId { get; set; }
    [DataMember] public string DocumentLink { get; set; }
  }
}