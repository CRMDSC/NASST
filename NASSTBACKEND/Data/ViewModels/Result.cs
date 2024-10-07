using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace NASSTBACKEND.Data.ViewModels
{
    [DataContract]
    public class Result<TPayload>
    {
        [DataMember] public TPayload Payload { get; set; }
        [DataMember] public int Status { get; set; } = 200;
        [DataMember] public List<Error> Errors { get; set; } = new List<Error>();

        [IgnoreDataMember, JsonIgnore] public bool Succeeded => Errors.Count == 0 && Status == 200;

        public static implicit operator Result<TPayload>(TPayload value) => new Result<TPayload>
        {
            Payload = value
        };

        public Result<TPayload> With(params Error[] error)
        {
            Errors.AddRange(error);
            return this;
        }
    }
}