using Orms.Domain.Enums;

namespace Orms.Domain.Entities;

public class ApplicationUser
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public required AppRole Role { get; set; }
    public int? BusinessUnitId { get; set; }
    public BusinessUnit? BusinessUnit { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
