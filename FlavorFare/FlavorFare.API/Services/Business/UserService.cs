using FlavorFare.API.Interfaces.Services.Business;
using FlavorFare.Data.Entities;
using FlavorFare.Data.Interfaces;

namespace FlavorFare.API.Services.Business
{
    public class UserService : IUserService
    {
        private readonly IRepository<FlavorFareUser> _repository;

        public UserService(IRepository<FlavorFareUser> repository)
        {
            _repository = repository;
        }

        public async Task AddUser(FlavorFareUser user)
        {
            _repository.Create(user);
        }

        public async Task<FlavorFareUser> GetUserAsync(int userId)
        {
            return _repository.FindByCondition(u => u.Id.ToString() == userId.ToString()).FirstOrDefault();
        }

        public async Task<IEnumerable<FlavorFareUser>> GetUsersAsync()
        {
            return _repository.FindAll();
        }
    }
}