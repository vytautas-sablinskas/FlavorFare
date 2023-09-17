using FlavorFare.API.Errors;

namespace FlavorFare.API.Interfaces.Services.Validators
{
    public interface IEntityValidatorService
    {
        EntityValidationResult Validate(int? reservationId = null, int? userId = null, int? restaurantId = null, int? tableId = null);
    }
}