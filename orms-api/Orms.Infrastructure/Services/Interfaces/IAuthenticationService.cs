using Orms.Domain.Entities;

namespace Orms.Infrastructure.Services.Interfaces;

public interface IAuthenticationService
{
    Task<(bool Success, string Message, string? Token, ApplicationUser? User)> LoginAsync(string username, string password);
    Task<(bool Success, string Message)> RegisterAsync(string username, string email, string fullName, string password, AppRole role);
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
    string GenerateJwtToken(ApplicationUser user);
}
