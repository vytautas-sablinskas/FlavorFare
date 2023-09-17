using FlavorFare.API.Errors.Exceptions;
using FlavorFare.API.Interfaces.Errors;
using Microsoft.AspNetCore.Mvc;

public class EntityNotFoundExceptionStrategy : IExceptionStrategy
{
    public bool CanHandle(Exception exception) => exception is EntityNotFoundException;

    public IActionResult Handle(Exception exception)
    {
        return new NotFoundObjectResult(exception.Message);
    }
}