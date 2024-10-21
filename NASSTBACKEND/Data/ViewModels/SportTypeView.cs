using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace NASSTBACKEND.Data.ViewModels
{
    [DataContract]
    public class SportTypeView
    {
        [DataMember] public int Id { get; set; }
        [DataMember] public string Name { get; set; }
        [DataMember] public int PlayersCount { get; set; }
        [DataMember] public int TeamsCount { get; set; }
        //add players type and category
        //add new entity players category
        
    }
}