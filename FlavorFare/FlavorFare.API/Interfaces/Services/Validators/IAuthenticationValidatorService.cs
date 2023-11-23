namespace FlavorFare.API.Interfaces.Services.Validators
{
    public interface IAuthenticationValidatorService
    {
        ValidationResult Validate(string userId);
    }
}