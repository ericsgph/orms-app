using Microsoft.AspNetCore.Mvc;
using Orms.Api.Controllers;
using Orms.Domain.Entities;
using Orms.Infrastructure.Services.Interfaces;

namespace Orms.Api.Controllers;

[ApiController]
[Route("v1/api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IApplicationUserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(IApplicationUserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAllUsers()
    {
        try
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApplicationUser>> GetUserById(int id)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { message = $"User with ID {id} not found" });

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user with ID {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApplicationUser>> CreateUser([FromBody] ApplicationUser user)
    {
        try
        {
            if (user == null)
                return BadRequest("User cannot be null");

            var createdUser = await _userService.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        }
        catch (ArgumentNullException ex)
        {
            _logger.LogWarning(ex, "Invalid user data provided");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing user
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] ApplicationUser user)
    {
        try
        {
            if (user == null)
                return BadRequest("User cannot be null");

            var updatedUser = await _userService.UpdateUserAsync(id, user);
            return Ok(updatedUser);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid user data provided");
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "User not found");
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user with ID {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a user
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "User not found");
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user with ID {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get users by role ID
    /// </summary>
    [HttpGet("role/{roleId:int}")]
    public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetUsersByRole(int roleId)
    {
        try
        {
            var users = await _userService.GetUsersByRoleAsync(roleId);
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users for role {RoleId}", roleId);
            return StatusCode(500, "Internal server error");
        }
    }
}
