using IdentityServer4.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace NASSTBACKEND.Options
{
    public class Security
    {
        public string SecretKey { get; set; }
        public int TokenTimeout { get; set; }
        public int RefreshTokenDaysTimeout { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string ClientId { get; set; }
        public string ClientSecretKey { get; set; }
        public string AllowedScopes { get; set; }
        public string ApiScopeDisplayName { get; set; }
        public SecurityKey SecurityKey => new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
        public Secret ClientSecret => new Secret(ClientSecretKey.Sha256());

    }
}