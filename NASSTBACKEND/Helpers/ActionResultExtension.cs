using Microsoft.AspNetCore.Mvc;
using NASSTBACKEND.Data.ViewModels;

namespace NASSTBACKEND.Helpers
{
    public static class ActionResultExtensions
    {
        public static IActionResult ToActionResult<T>(this Result<T> response) => new ObjectResult(response)
        {
            StatusCode = response.Status
        };
    }
}