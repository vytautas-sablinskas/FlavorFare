using System;

namespace FlavorFare.API.Dtos.Restaurants
{
    public record RestaurantDto
    (
        int Id,
        string Name,
        string Address,
        TimeSpan OpeningTime,
        TimeSpan ClosingTime,
        TimeSpan IntervalBetweenBookings
    );
}