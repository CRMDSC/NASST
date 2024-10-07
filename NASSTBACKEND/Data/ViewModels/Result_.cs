using Microsoft.AspNetCore.Mvc;
using System;

namespace NASSTBACKEND.Data.ViewModels
{
    public static class Result
    {
        public static Result<T> Ok<T>(T value = default) => new Result<T>
        {
            Payload = value
        };
        public static Result<T> NotFound<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 404
        };
        public static Result<T> BadRequest<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 400
        };
        public static Result<T> Unauthorized<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 401
        };
        public static Result<T> Forbidden<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 403
        };
        public static Result<T> NotAcceptable<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 406
        };
        public static Result<T> Conflict<T>(T value = default) => new Result<T>
        {
            Payload = value,
            Status = 409
        };

        public static Result<TDestination> From<TSource, TDestination>(Result<TSource> result, TDestination payload = default)
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