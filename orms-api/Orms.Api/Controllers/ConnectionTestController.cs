using Microsoft.AspNetCore.Mvc;
using Orms.Api.Utils;

namespace Orms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConnectionTestController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<ConnectionTestController> _logger;

    public ConnectionTestController(IConfiguration configuration, ILogger<ConnectionTestController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Test the Azure SQL Database connection
    /// </summary>
    [HttpGet("azure-sql")]
    public async Task<IActionResult> TestAzureSqlConnection()
    {
        var connectionString = _configuration.GetConnectionString("OrmsDb");

        if (string.IsNullOrEmpty(connectionString))
        {
            _logger.LogError("OrmsDb connection string not found in configuration");
            return BadRequest(new { error = "Connection string not configured" });
        }

        _logger.LogInformation("Testing Azure SQL connection...");
        var success = await AzureConnectionTester.TestConnectionAsync(connectionString);

        return success
            ? Ok(new { status = "success", message = "Azure SQL connection is working!" })
            : StatusCode(500, new { status = "failed", message = "Failed to connect to Azure SQL Database" });
    }
}
