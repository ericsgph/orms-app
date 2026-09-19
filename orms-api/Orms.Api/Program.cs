
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Orms.Infrastructure.Data;
using Orms.Infrastructure.Services;
using Orms.Infrastructure.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add configuration sources with environment variable support
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Add DbContext
var connectionString = builder.Configuration.GetConnectionString("OrmsDb") 
    ?? Environment.GetEnvironmentVariable("ConnectionStrings__OrmsDb");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'OrmsDb' not found in configuration or environment variables.");
}

builder.Services.AddDbContext<OrmsDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<DbInitializer>();

// Register Services
builder.Services.AddScoped<IApplicationUserService, ApplicationUserService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

// Add Authentication with JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? Environment.GetEnvironmentVariable("JwtSettings__SecretKey");

if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT SecretKey not found in configuration or environment variables.");
}

var issuer = jwtSettings["Issuer"] ?? "orms-api";
var audience = jwtSettings["Audience"] ?? "orms-api-users";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// Add Authorization
builder.Services.AddAuthorization();

builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
    c.CustomSchemaIds(type => type.FullName);
});

var app = builder.Build();

// Initialize database schema if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
    initializer.Initialize();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ORMS API v1");
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
