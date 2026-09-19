using Microsoft.EntityFrameworkCore;
using Orms.Domain.Entities;
using Orms.Infrastructure.Data;
using Orms.Infrastructure.Services.Interfaces;

namespace Orms.Infrastructure.Services;

public class RoleService : IRoleService
{
    private readonly OrmsDbContext _context;

    public RoleService(OrmsDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AppRole>> GetAllRolesAsync()
    {
        return await _context.AppRoles.ToListAsync();
    }

    public async Task<AppRole?> GetRoleByIdAsync(int id)
    {
        return await _context.AppRoles.FindAsync(id);
    }

    public async Task<AppRole> CreateRoleAsync(AppRole role)
    {
        if (role == null)
            throw new ArgumentNullException(nameof(role));

        _context.AppRoles.Add(role);
        await _context.SaveChangesAsync();
        return role;
    }

    public async Task<AppRole> UpdateRoleAsync(int id, AppRole role)
    {
        if (role == null)
            throw new ArgumentNullException(nameof(role));

        if (id != role.Id)
            throw new ArgumentException("Role ID mismatch.", nameof(role));

        var existingRole = await _context.AppRoles.FindAsync(id);
        if (existingRole == null)
            throw new KeyNotFoundException($"Role with ID {id} not found.");

        existingRole.Role = role.Role;
        existingRole.Description = role.Description;

        _context.AppRoles.Update(existingRole);
        await _context.SaveChangesAsync();
        return existingRole;
    }

    public async Task DeleteRoleAsync(int id)
    {
        var role = await _context.AppRoles.FindAsync(id);
        if (role == null)
            throw new KeyNotFoundException($"Role with ID {id} not found.");

        _context.AppRoles.Remove(role);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> RoleExistsAsync(int id)
    {
        return await _context.AppRoles.AnyAsync(r => r.Id == id);
    }
}
