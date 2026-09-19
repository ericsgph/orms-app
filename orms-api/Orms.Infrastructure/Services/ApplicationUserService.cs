using Microsoft.EntityFrameworkCore;
using Orms.Domain.Entities;
using Orms.Infrastructure.Data;
using Orms.Infrastructure.Services.Interfaces;

namespace Orms.Infrastructure.Services;

public class ApplicationUserService : IApplicationUserService
{
    private readonly OrmsDbContext _context;

    public ApplicationUserService(OrmsDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ApplicationUser>> GetAllUsersAsync()
    {
        return await _context.Users.Include(u => u.Role).ToListAsync();
    }

    public async Task<ApplicationUser?> GetUserByIdAsync(int id)
    {
        return await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<ApplicationUser> CreateUserAsync(ApplicationUser user)
    {
        if (user == null)
            throw new ArgumentNullException(nameof(user));

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<ApplicationUser> UpdateUserAsync(int id, ApplicationUser user)
    {
        if (user == null)
            throw new ArgumentNullException(nameof(user));

        if (id != user.Id)
            throw new ArgumentException("User ID mismatch.", nameof(user));

        var existingUser = await _context.Users.FindAsync(id);
        if (existingUser == null)
            throw new KeyNotFoundException($"User with ID {id} not found.");

        existingUser.FullName = user.FullName;
        existingUser.Email = user.Email;
        existingUser.Role = user.Role;
        existingUser.BusinessUnitId = user.BusinessUnitId;
        existingUser.IsActive = user.IsActive;

        _context.Users.Update(existingUser);
        await _context.SaveChangesAsync();
        return existingUser;
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            throw new KeyNotFoundException($"User with ID {id} not found.");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ApplicationUser>> GetUsersByRoleAsync(int roleId)
    {
        return await _context.Users
            .Where(u => u.Role.Id == roleId)
            .Include(u => u.Role)
            .ToListAsync();
    }

    public async Task<bool> UserExistsAsync(int id)
    {
        return await _context.Users.AnyAsync(u => u.Id == id);
    }
}
