using FlavorFare.API.Annotations;
using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Dtos.Reservations
{
    public record AddReservationDto
    (
        [Required(ErrorMessage = "Start time is required.")]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid start time format.")]
        DateTime StartTime,

        [Required(ErrorMessage = "End time is required.")]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid end time format.")]
        [CustomValidation(typeof(TimeDataNotations), "ValidateReservationTimeRange", ErrorMessage = "End time must be greater than start time.")]
        DateTime EndTime,

        [Required(AllowEmptyStrings = true)]
        [StringLength(100, MinimumLength = 0, ErrorMessage = "Extra Information must be between 0 and 100 characters.")]
        string ExtraInformation
    );
}