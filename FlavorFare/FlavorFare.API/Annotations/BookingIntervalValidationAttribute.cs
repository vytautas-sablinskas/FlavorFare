using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Annotations
{
    public class BookingIntervalValidationAttribute
    {
        public static System.ComponentModel.DataAnnotations.ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var instance = validationContext.ObjectInstance as dynamic;
            TimeSpan bookingInterval = (TimeSpan)value;

            if (bookingInterval < TimeSpan.FromHours(1) || bookingInterval > TimeSpan.FromHours(4))
            {
                return new System.ComponentModel.DataAnnotations.ValidationResult("Booking interval must be between 1 to 4 hours.");
            }

            if (instance.ClosingTime - instance.OpeningTime < bookingInterval)
            {
                return new System.ComponentModel.DataAnnotations.ValidationResult("Booking interval cannot be greater than the restaurant's operational hours.");
            }

            return System.ComponentModel.DataAnnotations.ValidationResult.Success;
        }
    }
}