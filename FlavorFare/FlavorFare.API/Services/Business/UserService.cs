using FlavorFare.Data.Interfaces;
using FlavorFare.Data.Entities;
using FlavorFare.API.Interfaces.Services.Business;

namespace FlavorFare.API.Services.Business
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _repository;

        public UserService(IRepository<User> repository)
        {
            _repository = repository;
        }

        public async Task AddUser(User user)
        {
            _repository.Create(user);
        }

        public async Task<User> GetUserAsync(int userId)
        {
            return _repository.FindByCondition(u => u.Id == userId).FirstOrDefault();
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return _repository.FindAll();
        }
    }
}