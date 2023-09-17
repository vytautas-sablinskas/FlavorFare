using FlavorFare.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FlavorFare.Data
{
    public class BiblioNestDbContext : DbContext
    {
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<User> Users { get; set; }

        public BiblioNestDbContext(DbContextOptions<BiblioNestDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}