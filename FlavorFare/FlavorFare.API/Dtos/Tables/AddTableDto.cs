using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Dtos.Tables
{
    public record AddTableDto
    (
        [Required(ErrorMessage = "Table size is required.")]
        [Range(1, 20, ErrorMessage = "Table size must be between 1 and 20.")]
        int Size
    );
}