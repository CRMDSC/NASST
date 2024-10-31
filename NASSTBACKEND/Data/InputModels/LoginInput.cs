using System.Runtime.Serialization;

namespace NASSTBACKEND.Data.InputModels
{
    [DataContract]
    public class LoginInput
    {
        [DataMember] public string? Email { get; set; }
        [DataMember] public string? Password { get; set; }
        [DataMember] public string? FCMToken { get; set; }
    } 
}