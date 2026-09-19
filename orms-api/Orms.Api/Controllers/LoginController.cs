using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Orms.Api.DTOs;
using Orms.Infrastructure.Services.Interfaces;

namespace Orms.Api.Controllers;

[ApiController]
[Route("v1/api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly IAuthenticationService _authService;
    private readonly ILogger<LoginController> _logger;

    public LoginController(IAuthenticationService authService, ILogger<LoginController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// User login endpoint - returns JWT token
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            if (request == null)
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "Request body cannot be empty"
                });

            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "Username and password are required"
                });

            var (success, message, token, user) = await _authService.LoginAsync(request.Username, request.Password);

            if (!success)
                return Unauthorized(new LoginResponse
                {
                    Success = false,
                    Message = message
                });

            var userInfo = new UserInfo
            {
                Id = user!.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role?.Role.ToString() ?? "User"
            };

            return Ok(new LoginResponse
            {
                Success = true,
                Message = message,
                Token = token,
                User = userInfo
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new LoginResponse
            {
                Success = false,
                Message = "An error occurred during login"
            });
        }
    }

    /// <summary>
    /// User registration endpoint
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            if (request == null)
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "Request body cannot be empty"
                });

            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Email) || 
                string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "All fields are required"
                });
            var (success, message) = await _authService.RegisterAsync(request.Username, request.Email, request.FullName, request.Password, request.Role);

            if (!success)
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = message
                });

            return Ok(new LoginResponse
            {
                Success = true,
                Message = message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new LoginResponse
            {
                Success = false,
                Message = "An error occurred during registration"
            });
        }
    }
}
