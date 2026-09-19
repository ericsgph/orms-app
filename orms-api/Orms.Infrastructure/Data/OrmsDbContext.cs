using Microsoft.EntityFrameworkCore;
using Orms.Domain.Entities;

namespace Orms.Infrastructure.Data;

public class OrmsDbContext : DbContext
{
    public DbSet<ApplicationUser> Users { get; set; }
    public DbSet<AppRole> AppRoles { get; set; }
    public DbSet<BusinessUnit> BusinessUnits { get; set; }
    public DbSet<RiskEvent> RiskEvents { get; set; }
    public DbSet<RiskCategory> RiskCategories { get; set; }

    public OrmsDbContext(DbContextOptions<OrmsDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure ApplicationUser
        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(256);
            entity.HasOne(e => e.Role)
                .WithMany()
                .HasForeignKey(e => e.RoleId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.BusinessUnit)
                .WithMany()
                .HasForeignKey(e => e.BusinessUnitId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure AppRole
        modelBuilder.Entity<AppRole>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Role).IsRequired();
        });

        // Configure BusinessUnit
        modelBuilder.Entity<BusinessUnit>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(256);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.HasOne(e => e.DepartmentHead)
                .WithMany()
                .HasForeignKey(e => e.DepartmentHeadUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure RiskEvent
        modelBuilder.Entity<RiskEvent>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(256);
            entity.Property(e => e.Description).HasMaxLength(2000);
        });

        // Configure RiskCategory
        modelBuilder.Entity<RiskCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(256);
            entity.Property(e => e.ParentCategoryId).HasMaxLength(256);
        });
    }
}

