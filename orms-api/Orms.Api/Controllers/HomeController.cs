using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Orms.Api.Controllers
{
    [Route("v1/api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Welcome to the ORMS API!");
        }
    }
}
