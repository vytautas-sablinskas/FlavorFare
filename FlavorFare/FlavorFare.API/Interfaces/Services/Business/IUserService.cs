using FlavorFare.Data.Entities;

namespace FlavorFare.API.Interfaces.Services.Business
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> GetUserAsync(int userId);
        Task AddUser(User user);
    }
}