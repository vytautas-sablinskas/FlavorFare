using FlavorFare.API.Services.Business;
using FlavorFare.API.Services.Validators;
using FlavorFare.Data;
using FlavorFare.Data.Interfaces;
using FlavorFare.Data.Entities;
using Microsoft.EntityFrameworkCore;
using FlavorFare.API.Interfaces.Services.Business;
using FlavorFare.API.Interfaces.Services.Validators;

namespace FlavorFare.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var configuration = builder.Configuration;
            ConfigureServices(builder.Services, configuration);

            var app = builder.Build();
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<BiblioNestDbContext>();
                context.Database.Migrate();
            }

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }

        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddAutoMapper(typeof(Program));
            services.AddControllers(options =>
            {
                options.Filters.Add<CustomExceptionFilter>();
            });

            services.AddScoped<IRepository<Restaurant>, Repository<Restaurant>>();
            services.AddScoped<IRepository<Table>, Repository<Table>>();
            services.AddScoped<IRepository<Reservation>, Repository<Reservation>>();
            services.AddScoped<IRepository<User>, Repository<User>>();

            services.AddScoped<IRestaurantService, RestaurantService>();
            services.AddScoped<IReservationService, ReservationService>();
            services.AddScoped<ITableService, TableService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IEntityValidatorService, EntityValidatorService>();

            services.AddDbContext<BiblioNestDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddRouting(options => options.LowercaseUrls = true);

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
        }
    }
}