using FlavorFare.API.Annotations;
using FlavorFare.API.Interfaces.Authentication;
using FlavorFare.API.Interfaces.Seeders;
using FlavorFare.API.Interfaces.Services.Business;
using FlavorFare.API.Interfaces.Services.Validators;
using FlavorFare.API.Policies;
using FlavorFare.API.Services.Authentication;
using FlavorFare.API.Services.Business;
using FlavorFare.API.Services.Seeders;
using FlavorFare.API.Services.Validators;
using FlavorFare.Data;
using FlavorFare.Data.Entities;
using FlavorFare.Data.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading;

namespace FlavorFare.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            var configuration = builder.Configuration;
            ConfigureServices(builder.Services, configuration);

            var app = builder.Build();
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<FlavorFareDbContext>();
                context.Database.Migrate();
            }

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowReactApp");
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            var dbSeeder = app.Services.CreateScope().ServiceProvider.GetRequiredService<IAuthenticationDbSeederService>();
            await dbSeeder.SeedAsync();
           
           
           
            app.Run();
        }

        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

            services.AddAutoMapper(typeof(Program));
            services.AddControllers(options =>
            {
                options.Filters.Add(new ValidateModelAttribute());
                options.Filters.Add<CustomExceptionFilter>();
            });

            services.AddIdentity<FlavorFareUser, IdentityRole>()
                .AddEntityFrameworkStores<FlavorFareDbContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["JWT:ValidIssuer"],
                    ValidAudience = configuration["JWT:ValidAudience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"])),
                    ClockSkew = TimeSpan.Zero
                };
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    builder =>
                    {
                        builder.WithOrigins("https://flavor-fare.vercel.app")
                               .AllowAnyHeader()
                               .AllowAnyMethod()
                               .AllowCredentials();
                    });
            });

            services.AddDbContext<FlavorFareDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IRepository<Restaurant>, Repository<Restaurant>>();
            services.AddScoped<IRepository<Table>, Repository<Table>>();
            services.AddScoped<IRepository<Reservation>, Repository<Reservation>>();
            services.AddScoped<IRepository<FlavorFareUser>, Repository<FlavorFareUser>>();
            services.AddScoped<IRepository<RefreshToken>, Repository<RefreshToken>>();

            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IRestaurantService, RestaurantService>();
            services.AddScoped<IReservationService, ReservationService>();
            services.AddScoped<ITableService, TableService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IEntityValidatorService, EntityValidatorService>();
            services.AddScoped<IAuthenticationDbSeederService, AuthenticationDbSeederService>();
            services.AddSingleton<IAuthorizationHandler, ResourceOwnerAuthorizationHandler>();

            services.AddAuthorization(options =>
            {
                options.AddPolicy(PolicyNames.ResourceOwner, policy => policy.Requirements.Add(new ResourceOwnerRequirement()));
            });

            services.AddRouting(options => options.LowercaseUrls = true);

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
        }
    }
}