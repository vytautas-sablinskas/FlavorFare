using FlavorFare.API.Dtos.Restaurants;
using FlavorFare.Data.Entities;

namespace FlavorFare.API.Interfaces.Services.Business
{
    public interface IRestaurantService
    {
        Task<IEnumerable<RestaurantDto>> GetRestaurantsAsync();

        RestaurantDto GetRestaurant(int restaurantId);

        RestaurantDto Add(AddRestaurantDto restaurant);

        void Update(int restaurantId, UpdateRestaurantDto restaurant);

        void Delete(int restaurantId);
    }
}