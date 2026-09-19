# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["orms-api/orms-api.slnx", "./"]
COPY ["orms-api/Orms.Api/Orms.Api.csproj", "orms-api/Orms.Api/"]
COPY ["orms-api/Orms.Domain/Orms.Domain.csproj", "orms-api/Orms.Domain/"]
COPY ["orms-api/Orms.Infrastructure/Orms.Infrastructure.csproj", "orms-api/Orms.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "orms-api/Orms.Api/Orms.Api.csproj"

# Copy source code
COPY ["orms-api/Orms.Api/", "orms-api/Orms.Api/"]
COPY ["orms-api/Orms.Domain/", "orms-api/Orms.Domain/"]
COPY ["orms-api/Orms.Infrastructure/", "orms-api/Orms.Infrastructure/"]

# Build the application
RUN dotnet build "orms-api/Orms.Api/Orms.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "orms-api/Orms.Api/Orms.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy published application
COPY --from=publish /app/publish .

# Create a non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
	CMD dotnet /app/HealthCheck.dll || exit 1

ENTRYPOINT ["dotnet", "Orms.Api.dll"]
