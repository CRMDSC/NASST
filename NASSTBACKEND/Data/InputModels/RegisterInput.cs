using System;
using System.Runtime.Serialization;

namespace NASSTBACKEND.Data.InputModels
{
    [DataContract]
  public  class RegisterInput
    {
        [DataMember] public string? FirstName { get; set; }
        [DataMember] public string? LastName { get; set; }
        [DataMember] public string? Email { get; set; }
        [DataMember] public string? Password { get; set; }
        [DataMember] public string? Role { get; set; }
    
    }
}