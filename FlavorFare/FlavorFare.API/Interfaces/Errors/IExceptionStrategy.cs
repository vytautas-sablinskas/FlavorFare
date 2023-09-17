using Microsoft.AspNetCore.Mvc;

namespace FlavorFare.API.Interfaces.Errors
{
    public interface IExceptionStrategy
    {
        bool CanHandle(Exception exception);

        IActionResult Handle(Exception exception);
    }
}