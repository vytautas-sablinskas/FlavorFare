using System.ComponentModel.DataAnnotations;
using FlavorFare.API.Annotations;

namespace FlavorFare.API.Dtos.Reservations
{
    public record AddReservationDto
    (
        [Required(ErrorMessage = "User ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be a positive integer.")]
        int UserId,

        [Required(ErrorMessage = "Start time is required.")]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid start time format.")]
        DateTime StartTime,

        [Required(ErrorMessage = "End time is required.")]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid end time format.")]
        [CustomValidation(typeof(TimeDataNotations), "ValidateTimeRange", ErrorMessage = "End time must be greater than start time.")]
        DateTime EndTime
    );
}