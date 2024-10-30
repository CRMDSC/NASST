using Microsoft.AspNetCore.Mvc;
using System;

namespace NASSTBACKEND.Data.ViewModels
{
    public static class Result
    {
#pragma warning disable CS8601 // Possible null reference assignment.
        public static Result<T> Ok<T>(T value = default) => new Result<T>
        {
            Payload = value
        };
#pragma warning restore CS8601 // Possible null reference assignment.
#pragma warning disable CS8601 // Possible null reference assignment.
        public static Result<T> NotFound<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 404
        };
#pragma warning restore CS8601 // Possible null reference assignment.
#pragma warning disable CS8601 // Possible null reference assignment.
        public static Result<T> BadRequest<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 400
        };
#pragma warning restore CS8601 // Possible null reference assignment.
#pragma warning disable CS8601 // Possible null reference assignment.
        public static Result<T> Unauthorized<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 401
        };
#pragma warning restore CS8601 // Possible null reference assignment.
#pragma warning disable CS8601 // Possible null reference assignment.
        public static Result<T> Forbidden<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 403
        };
#pragma warning restore CS8601 // Possible null reference assignment.
#pragma warning disable CS8601 // Possible null reference assignment.
        public static Result<T> NotAcceptable<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 406
        };
#pragma warning restore CS8601 // Possible null reference assignment.
#pragma warning disable CS8601 // Possible null reference assignment.
        public static Result<T> Conflict<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 409
        };
#pragma warning restore CS8601 // Possible null reference assignment.

#pragma warning disable CS8601 // Possible null reference assignment.
        public static Result<TDestination> From<TSource, TDestination>(Result<TSource> result, TDestination payload = default)
#pragma warning restore CS8601 // Possible null reference assignment.
        {
            return new Result<TDestination>
            {
                Errors = result.Errors,
                Payload = payload,
                Status = result.Status
            };
        }
    }
}