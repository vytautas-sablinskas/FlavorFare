using FlavorFare.API.Errors.Exceptions;
using FlavorFare.API.Interfaces.Errors;
using Microsoft.AspNetCore.Mvc;

namespace FlavorFare.API.Errors.Strategies
{
    public class ResourceUsageForbiddenExceptionStrategy : IExceptionStrategy
    {
        public bool CanHandle(Exception exception) => exception is ResourceUsageForbiddenException;

        public IActionResult Handle(Exception exception)
        {
            return new ForbidResult();
        }
    }
}