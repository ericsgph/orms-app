using Orms.Domain.Entities;

namespace Orms.Api.DTOs;

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public required AppRole Role { get; set; }
    public int? BusinessUnitId { get; set; }
    public bool IsActive { get; set; } = true;  
}
