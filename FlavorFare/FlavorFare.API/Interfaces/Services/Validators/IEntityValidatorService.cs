namespace FlavorFare.API.Interfaces.Services.Validators
{
    public interface IEntityValidatorService
    {
        ValidationResult Validate(int? reservationId = null, int? userId = null, int? restaurantId = null, int? tableId = null);
    }
}