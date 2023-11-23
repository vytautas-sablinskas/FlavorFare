using AutoMapper;
using FlavorFare.API.Dtos.Restaurants;
using FlavorFare.API.Interfaces.Services.Business;
using FlavorFare.API.Interfaces.Services.Validators;
using FlavorFare.Data.Entities;
using FlavorFare.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FlavorFare.API.Services.Business
{
    public class RestaurantService : IRestaurantService
    {
        private readonly IRepository<Restaurant> _repository;
        private readonly IMapper _mapper;
        private readonly IEntityValidatorService _entityValidatorService;

        public RestaurantService(IRepository<Restaurant> repository, IMapper mapper, IEntityValidatorService entityValidatorService)
        {
            _repository = repository;
            _mapper = mapper;
            _entityValidatorService = entityValidatorService;
        }

        public RestaurantDto Add(AddRestaurantDto addRestaurantDto)
        {
            var restaurant = _mapper.Map<Restaurant>(addRestaurantDto);
            _repository.Create(restaurant);

            return _mapper.Map<RestaurantDto>(restaurant);
        }

        public void Delete(int restaurantId)
        {
            var validationResult = _entityValidatorService.Validate(restaurantId: restaurantId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var restaurant = _repository.FindByCondition(r => r.Id == restaurantId).First();

            _repository.Delete(restaurant);
        }

        public RestaurantDto GetRestaurant(int restaurantId)
        {
            var validationResult = _entityValidatorService.Validate(restaurantId: restaurantId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var restaurant = _repository.FindByCondition(r => r.Id == restaurantId).FirstOrDefault();

            return _mapper.Map<RestaurantDto>(restaurant);
        }

        public async Task<IEnumerable<RestaurantDto>> GetRestaurantsAsync()
        {
            var restaurants = await _repository.FindAll().ToListAsync();

            return restaurants.Select(_mapper.Map<RestaurantDto>);
        }

        public RestaurantDto Update(int restaurantId, UpdateRestaurantDto updateReservationDto)
        {
            var validationResult = _entityValidatorService.Validate(restaurantId: restaurantId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var restaurant = _repository.FindByCondition(r => r.Id == restaurantId).FirstOrDefault();
            _mapper.Map(updateReservationDto, restaurant);

            _repository.Update(restaurant);

            return _mapper.Map<RestaurantDto>(restaurant);
        }
    }
}