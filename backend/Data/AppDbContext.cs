using FranchiseApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FranchiseApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Franchise> Franchises => Set<Franchise>();
    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // A franchise has many branches. Deleting a franchise deletes its branches.
        modelBuilder.Entity<Branch>()
            .HasOne<Franchise>()
            .WithMany()
            .HasForeignKey(b => b.FranchiseId)
            .OnDelete(DeleteBehavior.Cascade);

        // A branch has many products. Deleting a branch deletes its products.
        modelBuilder.Entity<Product>()
            .HasOne<Branch>()
            .WithMany()
            .HasForeignKey(p => p.BranchId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
