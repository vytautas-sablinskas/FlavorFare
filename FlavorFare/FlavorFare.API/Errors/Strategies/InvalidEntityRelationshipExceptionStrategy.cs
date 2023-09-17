using FlavorFare.API.Errors.Exceptions;
using FlavorFare.API.Interfaces.Errors;
using Microsoft.AspNetCore.Mvc;

public class InvalidEntityRelationshipExceptionStrategy : IExceptionStrategy
{
    public bool CanHandle(Exception exception) => exception is InvalidEntityRelationshipException;

    public IActionResult Handle(Exception exception)
    {
        return new BadRequestObjectResult(exception.Message);
    }
}