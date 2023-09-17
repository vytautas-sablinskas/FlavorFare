using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Dtos.Restaurants
{
    public record RestaurantDto
    (
        [Required(ErrorMessage = "Restaurant ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Restaurant ID must be a positive integer.")]
        int Id,

        [Required(ErrorMessage = "Restaurant name is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Restaurant name must be between 3 and 100 characters.")]
        string Name,

        [Required(ErrorMessage = "Address is required.")]
        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters.")]
        string Address
    );
}
