using Orms.Domain.Entities;

namespace Orms.Infrastructure.Services.Interfaces;

public interface IRoleService
{
    Task<IEnumerable<AppRole>> GetAllRolesAsync();
    Task<AppRole?> GetRoleByIdAsync(int id);
    Task<AppRole> CreateRoleAsync(AppRole role);
    Task<AppRole> UpdateRoleAsync(int id, AppRole role);
    Task DeleteRoleAsync(int id);
    Task<bool> RoleExistsAsync(int id);
}
