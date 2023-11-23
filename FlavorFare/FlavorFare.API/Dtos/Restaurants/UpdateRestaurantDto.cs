using FlavorFare.API.Annotations;
using System;
using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Dtos.Restaurants
{
    public record UpdateRestaurantDto
    (
        [Required(ErrorMessage = "Restaurant name is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Restaurant name must be between 3 and 100 characters.")]
        string Name,

        [Required(ErrorMessage = "Address is required.")]
        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters.")]
        string Address,

        [DataType(DataType.Time, ErrorMessage = "Invalid start time format.")]
        [Required(ErrorMessage = "Opening time is required.")]
        TimeSpan OpeningTime,

        [CustomValidation(typeof(ClosingTimeValidationAttribute), "IsValid")]
        [DataType(DataType.Time, ErrorMessage = "Invalid start time format.")]
        [Required(ErrorMessage = "Closing time is required.")]
        TimeSpan ClosingTime,

        [CustomValidation(typeof(BookingIntervalValidationAttribute), "IsValid")]
        [DataType(DataType.Time, ErrorMessage = "Invalid start time format.")]
        [Required(ErrorMessage = "Interval between bookings is required.")]
        TimeSpan IntervalBetweenBookings
    );
}