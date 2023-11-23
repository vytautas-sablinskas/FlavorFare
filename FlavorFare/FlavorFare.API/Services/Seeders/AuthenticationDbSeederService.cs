using FlavorFare.API.Interfaces.Seeders;
using FlavorFare.API.Roles;
using FlavorFare.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace FlavorFare.API.Services.Seeders
{
    public class AuthenticationDbSeederService : IAuthenticationDbSeederService
    {
        private readonly UserManager<FlavorFareUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthenticationDbSeederService(UserManager<FlavorFareUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedAsync()
        {
            await AddDefaultRoles();
            await AddAdminRoles();
        }

        private async Task AddAdminRoles()
        {
            var newAdminUser = new FlavorFareUser()
            {
                UserName = "admin",
                Email = "admin@admin.com"
            };

            var adminUserExists = await _userManager.FindByNameAsync(newAdminUser.UserName);
            if (adminUserExists != null)
                return;

            var createAdminUserResult = await _userManager.CreateAsync(newAdminUser, "Password1!");
            if (createAdminUserResult.Succeeded)
            {
                await _userManager.AddToRolesAsync(newAdminUser, UserRoles.All);
            }
        }

        private async Task AddDefaultRoles()
        {
            foreach (var role in UserRoles.All)
            {
                var roleExists = await _roleManager.RoleExistsAsync(role);
                if (!roleExists)
                    await _roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}