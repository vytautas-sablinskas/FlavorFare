using FlavorFare.Data.Entities;

namespace FlavorFare.API.Interfaces.Services.Business
{
    public interface IUserService
    {
        Task<IEnumerable<FlavorFareUser>> GetUsersAsync();

        Task<FlavorFareUser> GetUserAsync(int userId);

        Task AddUser(FlavorFareUser user);
    }
}