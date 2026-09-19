using Microsoft.AspNetCore.Mvc;
using Orms.Domain.Entities;
using Orms.Infrastructure.Services.Interfaces;

namespace Orms.Api.Controllers;

[ApiController]
[Route("v1/api/[controller]")]
public class RoleController : ControllerBase
{
    private readonly IRoleService _roleService;
    private readonly ILogger<RoleController> _logger;

    public RoleController(IRoleService roleService, ILogger<RoleController> logger)
    {
        _roleService = roleService;
        _logger = logger;
    }

    /// <summary>
    /// Get all roles
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppRole>>> GetAllRoles()
    {
        try
        {
            var roles = await _roleService.GetAllRolesAsync();
            return Ok(roles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving roles");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get role by ID
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppRole>> GetRoleById(int id)
    {
        try
        {
            var role = await _roleService.GetRoleByIdAsync(id);
            if (role == null)
                return NotFound(new { message = $"Role with ID {id} not found" });

            return Ok(role);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving role with ID {RoleId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new role
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<AppRole>> CreateRole([FromBody] AppRole role)
    {
        try
        {
            if (role == null)
                return BadRequest("Role cannot be null");

            var createdRole = await _roleService.CreateRoleAsync(role);
            return CreatedAtAction(nameof(GetRoleById), new { id = createdRole.Id }, createdRole);
        }
        catch (ArgumentNullException ex)
        {
            _logger.LogWarning(ex, "Invalid role data provided");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating role");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing role
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] AppRole role)
    {
        try
        {
            if (role == null)
                return BadRequest("Role cannot be null");

            var updatedRole = await _roleService.UpdateRoleAsync(id, role);
            return Ok(updatedRole);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid role data provided");
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Role not found");
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating role with ID {RoleId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a role
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        try
        {
            await _roleService.DeleteRoleAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Role not found");
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting role with ID {RoleId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
