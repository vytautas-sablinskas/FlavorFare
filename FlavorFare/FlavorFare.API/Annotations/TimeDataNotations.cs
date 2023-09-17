using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Annotations
{
    public class TimeDataNotations
    {
        public static ValidationResult ValidateTimeRange(DateTime EndTime, ValidationContext context)
        {
            var instance = context.ObjectInstance as dynamic;
            if (instance.EndTime <= instance.StartTime)
            {
                return new ValidationResult("EndTime must be greater than StartTime.");
            }
            return ValidationResult.Success;
        }
    }
}