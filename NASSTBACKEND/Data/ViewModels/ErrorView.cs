using System;
using System.Runtime.Serialization;

namespace NASSTBACKEND.Data.ViewModels
{
    [DataContract]
    public class Error
    {   
        [DataMember] public string? Code { get; set; }
        [DataMember] public string? Description { get; set; }
        [DataMember] public string? Path { get; set; }
        [DataMember] public DateTime? Time { get; set; }

        public Error WithCode(string code) => new Error
        {
            Code = code,
            Description = Description,
            Path = Path
        };
        
        public Error WithDescription(string description) => new Error
        {
            Code = Code,
            Description = description,
            Path = Path
        };

        public Error WithPath(string path) => new Error
        {
            Code = Code,
            Description = Description,
            Path = path
        };

        public static Error NotFound(string description = "Resource not found", string? path = null) => new Error
        {
            Code = nameof(NotFound),
            Description = description,
            Path = path
        };

        public static Error InvalidParameter(string description = "Invalid parameter", string? path = null) => new Error
        {
            Code = nameof(InvalidParameter),
            Description = description,
            Path = path
        };

        public static Error IncorrectPassword(string? path = null) => new Error
        {
            Code = nameof(IncorrectPassword),
            Description = "Password is incorrect",
            Path = path
        };

        public static Error PermissionDenied(string description = "You do not have access", string? path = null) => new Error
        {
            Code = nameof(PermissionDenied),
            Description = description,
            Path = path
        };

        public static Error Conflict(string description = "A conflict occured", string? path = null) => new Error
        {
            Code = nameof(Conflict),
            Description = description,
            Path = path
        };

        public static Error NotAcceptable(string description = "The data provided is not acceptable to process the request", string? path = null) => new Error
        {
            Code = nameof(Conflict),
            Description = description,
            Path = path
        };

        public static Error BadRequest(string description = "Bad request", string? path = null, DateTime? time = null) => new Error
        {
            Code = nameof(BadRequest),
            Description = description,
            Path = path,
            Time = time
        };
    }
}