using FlavorFare.Data.Entities;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace FlavorFare.API.Interfaces.Authentication
{
    public interface IJwtTokenService
    {
        (string AccessToken, string RefreshToken) CreateTokens(string userName, string userId, IEnumerable<string> userRoles);

        Task<(string AccessToken, string RefreshToken)?> RefreshTokensAsync(UserManager<FlavorFareUser> userManager, string refreshToken);

        bool RevokeToken(string refreshToken);
    }
}