using FlavorFare.API.Errors.Exceptions;
using FlavorFare.API.Interfaces.Errors;
using Microsoft.AspNetCore.Mvc;

namespace FlavorFare.API.Errors.Strategies
{
    public class InvalidBookingExceptionStrategy : IExceptionStrategy
    {
        public bool CanHandle(Exception exception) => exception is InvalidBookingException;

        public IActionResult Handle(Exception exception)
        {
            return new BadRequestObjectResult(exception.Message);
        }
    }
}