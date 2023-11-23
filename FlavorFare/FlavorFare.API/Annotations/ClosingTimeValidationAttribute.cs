using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Annotations
{
    public class ClosingTimeValidationAttribute
    {
        public static System.ComponentModel.DataAnnotations.ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var instance = validationContext.ObjectInstance as dynamic;
            TimeSpan closingTime = (TimeSpan)value;
            TimeSpan openingTime = instance.OpeningTime;

            if (closingTime <= openingTime)
            {
                return new System.ComponentModel.DataAnnotations.ValidationResult("Closing time must be later than opening time.");
            }

            return System.ComponentModel.DataAnnotations.ValidationResult.Success;
        }
    }
}