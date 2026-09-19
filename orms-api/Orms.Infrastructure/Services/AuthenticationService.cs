using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Orms.Domain.Entities;
using Orms.Infrastructure.Data;
using Orms.Infrastructure.Services.Interfaces;

namespace Orms.Infrastructure.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly OrmsDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthenticationService(OrmsDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<(bool Success, string Message, string? Token, ApplicationUser? User)> LoginAsync(string username, string password)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                return (false, "Username and password are required.", null, null);

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == username && u.IsActive);

            if (user == null)
                return (false, "Invalid username or password.", null, null);

            var token = GenerateJwtToken(user);
            return (true, "Login successful.", token, user);
        }
        catch (Exception ex)
        {
            return (false, $"An error occurred during login: {ex.Message}", null, null);
        }
    }

    public async Task<(bool Success, string Message)> RegisterAsync(string username, string email, string fullName, string password, AppRole role)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                return (false, "All fields are required.");

            var userExists = await _context.Users.AnyAsync(u => u.Email == username);
            if (userExists)
                return (false, "Username already exists.");

            var emailExists = await _context.Users.AnyAsync(u => u.Email == email);
            if (emailExists)
                return (false, "Email already exists.");

            var passwordHash = HashPassword(password);

            var newUser = new ApplicationUser
            {
                FullName = fullName,
                Email = email,
                RoleId = role.Id,
                Role = role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return (true, "User registered successfully.");
        }
        catch (Exception ex)
        {
            return (false, $"An error occurred during registration: {ex.Message}");
        }
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string hash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch
        {
            return false;
        }
    }

    public string GenerateJwtToken(ApplicationUser user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? "your-super-secret-key-here"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.GivenName, user.FullName),
            new Claim(ClaimTypes.Role, user.Role?.Role.ToString() ?? "User")
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpirationMinutes"] ?? "60")),
            signingCredentials: credentials
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(token);
    }
}
