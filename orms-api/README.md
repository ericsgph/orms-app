# ORMS Backend Scaffold — Wiring Instructions

These files were generated without a local .NET SDK, so run these steps yourself
in VS Code to wire them into a real project.

## 1. Create the solution and projects

```bash
mkdir orms-api && cd orms-api
dotnet new sln -n Orms

dotnet new classlib -n Orms.Domain
dotnet new classlib -n Orms.Infrastructure
dotnet new webapi -n Orms.Api --use-controllers

dotnet sln add Orms.Domain Orms.Infrastructure Orms.Api

dotnet add Orms.Infrastructure reference Orms.Domain
dotnet add Orms.Api reference Orms.Domain Orms.Infrastructure

dotnet add Orms.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add Orms.Infrastructure package Microsoft.EntityFrameworkCore.Design
dotnet add Orms.Api package Microsoft.EntityFrameworkCore.Design
```

## 2. Copy the generated files in

- `Orms.Domain/Enums/RiskEnums.cs` → into your `Orms.Domain/Enums/` folder
- `Orms.Domain/Entities/*.cs` → into your `Orms.Domain/Entities/` folder
- `Orms.Infrastructure/Data/OrmsDbContext.cs` → into your `Orms.Infrastructure/Data/` folder

## 3. Register the DbContext in `Orms.Api/Program.cs`

```csharp
builder.Services.AddDbContext<OrmsDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("OrmsDb")));
```

Add to `Orms.Api/appsettings.json`:

```json
"ConnectionStrings": {
  "OrmsDb": "Server=localhost;Database=OrmsDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

## 4. Generate and apply the migration

Instead of running `sql/001_InitialCreate.sql` by hand, let EF generate the
real migration from the entities (recommended — keeps your model and schema
in sync):

```bash
cd Orms.Api
dotnet ef migrations add InitialCreate --project ../Orms.Infrastructure --startup-project .
dotnet ef database update --project ../Orms.Infrastructure --startup-project .
```

The `sql/001_InitialCreate.sql` file in this scaffold is there as a reference
of what that migration should produce — useful for reviewing the schema
before you run it, or for a DBA who wants to review raw DDL.

## 5. Run it

```bash
dotnet run --project Orms.Api
```

Open the Swagger UI (usually `https://localhost:xxxx/swagger`) to confirm it
boots before you write your first controller.

## Next step

Once this builds and the migration applies cleanly, the next logical piece
is `RiskEventsController` with the Submit → Endorse → Assess status-transition
flow. Ask for that next and I'll generate the controller plus a
`RiskEventStatusService` that encodes the allowed transitions from the use
case (Draft → Submitted → PendingEndorsement → PendingRiskReview → ...).
