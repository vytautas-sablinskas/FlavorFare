using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Dtos.Authentication
{
    public record LoginDto
    (
        [Required]
        string UserName,

        [Required]
        string Password
    );
}