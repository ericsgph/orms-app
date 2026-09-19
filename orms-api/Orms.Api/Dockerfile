# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files
COPY ["Orms.Api/Orms.Api.csproj", "Orms.Api/"]
COPY ["Orms.Domain/Orms.Domain.csproj", "Orms.Domain/"]
COPY ["Orms.Infrastructure/Orms.Infrastructure.csproj", "Orms.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Orms.Api/Orms.Api.csproj"

# Copy source code
COPY . .

# Build the application
WORKDIR "/src/Orms.Api"
RUN dotnet build "Orms.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Orms.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Orms.Api.dll"]
