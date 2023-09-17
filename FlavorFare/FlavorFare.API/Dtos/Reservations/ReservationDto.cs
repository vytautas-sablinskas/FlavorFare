using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Dtos.Reservations
{
    public record ReservationDto
    (
        [Required(ErrorMessage = "Reservation ID is required.")]
        int Id,

        [Required(ErrorMessage = "Table ID is required.")]
        int TableId,

        [Required(ErrorMessage = "User ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be a positive integer.")]
        int UserId,

        [Required(ErrorMessage = "Start time is required.")]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid start time format.")]
        DateTime StartTime,

        [Required(ErrorMessage = "End time is required.")]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid end time format.")]
        [CustomValidation(typeof(ReservationDto), "ValidateTimeRange", ErrorMessage = "End time must be greater than start time.")]
        DateTime EndTime
    );
}
