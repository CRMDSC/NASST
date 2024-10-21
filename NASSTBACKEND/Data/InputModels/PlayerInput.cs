using System;
using System.Runtime.Serialization;

namespace NASSTBACKEND.Data.InputModels
{
    [DataContract]
  public  class PlayerInput
    {
        [DataMember] public string FirstName { get; set; }
        [DataMember] public string LastName { get; set; }
        [DataMember] public string Email { get; set; }
        [DataMember] public string PhoneNumber { get; set; }
        [DataMember] public int CategoryId { get; set; }
    }
}