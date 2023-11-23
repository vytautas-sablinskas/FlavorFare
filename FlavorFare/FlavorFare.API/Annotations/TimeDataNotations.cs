using System.ComponentModel.DataAnnotations;

namespace FlavorFare.API.Annotations
{
    public class TimeDataNotations
    {
        public static System.ComponentModel.DataAnnotations.ValidationResult ValidateReservationTimeRange(DateTime EndTime, ValidationContext context)
        {
            var instance = context.ObjectInstance as dynamic;
            if (instance.EndTime <= instance.StartTime)
            {
                return new System.ComponentModel.DataAnnotations.ValidationResult("EndTime must be greater than StartTime.");
            }

            if (instance.StartTime < DateTime.Now)
            {
                return new System.ComponentModel.DataAnnotations.ValidationResult("StartTime cannot be in the past.");
            }

            if (instance.EndTime < DateTime.Now)
            {
                return new System.ComponentModel.DataAnnotations.ValidationResult("EndTime cannot be in the past.");
            }

            return System.ComponentModel.DataAnnotations.ValidationResult.Success;
        }
    }
}
