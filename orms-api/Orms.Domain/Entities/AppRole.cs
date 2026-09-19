namespace Orms.Domain.Entities;

using Orms.Domain.Enums;

public class AppRole
{
    public int Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
