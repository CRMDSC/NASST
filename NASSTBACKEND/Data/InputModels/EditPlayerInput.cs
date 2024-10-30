using System;
using System.Runtime.Serialization;
using NASSTBACKEND.Data.Entities;

namespace NASSTBACKEND.Data.InputModels
{
    [DataContract]
  public  class EditPlayerInput
    {
        [DataMember] public int Id { get; set; }
        [DataMember] public string? FirstName { get; set; }
        [DataMember] public string? LastName { get; set; }
        [DataMember] public string? Email { get; set; }
        [DataMember] public string? PhoneNumber { get; set; }
        [DataMember] public int CategoryId { get; set; }
        [DataMember] public Category? Category { get; set; }
    }
}