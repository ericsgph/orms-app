using Orms.Domain.Entities;

namespace Orms.Infrastructure.Services.Interfaces;

public interface IApplicationUserService
{
    Task<IEnumerable<ApplicationUser>> GetAllUsersAsync();
    Task<ApplicationUser?> GetUserByIdAsync(int id);
    Task<ApplicationUser> CreateUserAsync(ApplicationUser user);
    Task<ApplicationUser> UpdateUserAsync(int id, ApplicationUser user);
    Task DeleteUserAsync(int id);
    Task<IEnumerable<ApplicationUser>> GetUsersByRoleAsync(int roleId);
    Task<bool> UserExistsAsync(int id);
}
