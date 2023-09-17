using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Dtos.Tables
{
    public record AddTableDto
    (
        [Required(ErrorMessage = "Table size is required.")]
        [Range(1, 40, ErrorMessage = "Table size must be between 1 and 40.")]
        int Size
    );
}
