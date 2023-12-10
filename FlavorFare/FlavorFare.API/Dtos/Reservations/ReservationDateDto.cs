using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Dtos.Reservations
{

    public record ReservationDateDto(
        [Required]
        DateOnly Date
    );
}