using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace NASSTBACKEND.Data.ViewModels
{
    [DataContract]
    public class LoginView
    {
        [DataMember] public string AccessToken { get; set; }
        [JsonIgnore] public string RefreshToken { get; set; }
        [DataMember] public int AccessTokenExpiresIn { get; set; }
        [DataMember] public int RefreshTokenExpiresIn { get; set; }
    }
}