using System;
using System.Runtime.Serialization;

namespace NASSTBACKEND.Data.InputModels
{
    [DataContract]
  public  class UpdateSportTypeInput
    {
        [DataMember] public int Id { get; set; }
        [DataMember] public string Name { get; set; }
        [DataMember] public int PlayersCount { get; set; }
        [DataMember] public int TeamsCount { get; set; }
    }
}