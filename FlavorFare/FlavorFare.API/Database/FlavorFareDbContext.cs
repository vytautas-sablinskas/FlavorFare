using FlavorFare.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FlavorFare.Data
{
    public class FlavorFareDbContext : IdentityDbContext<FlavorFareUser>
    {
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<FlavorFareUser> Users { get; set; }

        public FlavorFareDbContext(DbContextOptions<FlavorFareDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}