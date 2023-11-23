using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Dtos.Tables
{
    public record TableDto
    (
        [Required(ErrorMessage = "Table ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Table ID must be a positive integer.")]
        int Id,

        [Required(ErrorMessage = "Restaurant ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Restaurant ID must be a positive integer.")]
        int RestaurantId,

        [Required(ErrorMessage = "Table size is required.")]
        [Range(1, 20, ErrorMessage = "Table size must be between 1 and 20.")]
        int Size
    );
}