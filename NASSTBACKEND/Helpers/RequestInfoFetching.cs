using System;
using Microsoft.AspNetCore.Http;

namespace NASSTBACKEND.Helpers
{
    public static class RequestInfoFetching
    {
        public static string IpAddress(HttpContext httpContext, HttpRequest httpRequest)
        {
            if (httpRequest.Headers.ContainsKey("X-Forwarded-For"))
                return httpRequest.Headers["X-Forwarded-For"];
            else
                return httpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }

        public static string UserAgent(HttpContext httpContext, HttpRequest httpRequest)
        {
            string result = null;
            if (httpRequest.Headers.ContainsKey("User-Agent"))
                if (httpRequest.Headers["User-Agent"].Count > 0)
                    result = httpRequest.Headers["User-Agent"][0];

            if (httpRequest.Headers.ContainsKey("sec-ch-ua"))
                if (httpRequest.Headers["sec-ch-ua"].Count > 0)
                    result = result == null ? httpRequest.Headers["sec-ch-ua"][0] : result +  " | " + httpRequest.Headers["sec-ch-ua"][0];

            return result;
        }

        public static string Path(HttpRequest httpRequest)
        {
            return httpRequest.Path;
        }

        public static string Protocol(HttpRequest httpRequest)
        {
            return httpRequest.Protocol;
        }

        public static string Method(HttpRequest httpRequest)
        {
            return httpRequest.Method;
        }

        public static void SetTokenCookie(HttpResponse httpResponse, string token, int expires)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = expires < 0 ? DateTime.UtcNow.AddDays(10000) : DateTime.UtcNow.AddDays(expires),
                Secure = true,
                SameSite = SameSiteMode.None
            };
            httpResponse.Cookies.Append("NASST.RefreshToken", token, cookieOptions);
        }
    }
}