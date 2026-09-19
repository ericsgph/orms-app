using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orms.Infrastructure.Data;
using Orms.Domain.Entities;

namespace Orms.Api.Controllers;

[ApiController]
[Route("v1/api/[controller]")]
public class AppRolesController : ControllerBase
{
    private readonly OrmsDbContext _context;

    public AppRolesController(OrmsDbContext context)
    {
        _context = context;
    }

    // GET: api/AppRoles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppRole>>> Get()
    {
        return await _context.AppRoles.ToListAsync();
    }

    // GET: api/AppRoles/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppRole>> Get(int id)
    {
        var role = await _context.AppRoles.FindAsync(id);
        if (role == null) return NotFound();
        return role;
    }

    // POST: api/AppRoles
    [HttpPost]
    public async Task<ActionResult<AppRole>> Post([FromBody] AppRole role)
    {
        _context.AppRoles.Add(role);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = role.Id }, role);
    }

    // PUT: api/AppRoles/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] AppRole role)
    {
        if (id != role.Id) return BadRequest();

        _context.Entry(role).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.AppRoles.AnyAsync(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // DELETE: api/AppRoles/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var role = await _context.AppRoles.FindAsync(id);
        if (role == null) return NotFound();

        _context.AppRoles.Remove(role);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
