using FlavorFare.API.Dtos.Restaurants;

namespace FlavorFare.API.Interfaces.Services.Business
{
    public interface IRestaurantService
    {
        Task<IEnumerable<RestaurantDto>> GetRestaurantsAsync();

        RestaurantDto GetRestaurant(int restaurantId);

        RestaurantDto Add(AddRestaurantDto restaurant);

        RestaurantDto Update(int restaurantId, UpdateRestaurantDto restaurant);

        void Delete(int restaurantId);
    }
}