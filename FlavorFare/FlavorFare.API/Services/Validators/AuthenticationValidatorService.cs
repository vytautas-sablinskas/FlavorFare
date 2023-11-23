using FlavorFare.API.Interfaces.Services.Validators;
using FlavorFare.Data.Entities;
using FlavorFare.Data.Interfaces;

namespace FlavorFare.API.Services.Validators
{
    public class AuthenticationValidatorService : IAuthenticationValidatorService
    {
        IRepository<FlavorFareUser> _userRepository;

        public AuthenticationValidatorService(IRepository<FlavorFareUser> userRepository)
        {
            _userRepository = userRepository;
        }

        public ValidationResult Validate(string userId)
        {
            var user =  _userRepository.FindByCondition(u => u.Id == userId);
            if (user == null)
            {
                return new ValidationResult
                {
                    IsValid = false,
                    ErrorMessage = "Such user does not exist",
                    ErrorType = ValidationErrorType.EntityNotFound
                };
            }

            return new ValidationResult();
        }
    }
}
