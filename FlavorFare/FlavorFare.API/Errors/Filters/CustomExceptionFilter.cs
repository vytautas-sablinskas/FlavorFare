using FlavorFare.API.Errors.Strategies;
using FlavorFare.API.Interfaces.Errors;
using Microsoft.AspNetCore.Mvc.Filters;

public class CustomExceptionFilter : ExceptionFilterAttribute
{
    private readonly IList<IExceptionStrategy> _exceptionStrategies;

    public CustomExceptionFilter()
    {
        _exceptionStrategies = new List<IExceptionStrategy>
        {
            new EntityNotFoundExceptionStrategy(),
            new InvalidEntityRelationshipExceptionStrategy(),
            new ResourceUsageForbiddenExceptionStrategy(),
            new InvalidBookingExceptionStrategy(),
        };
    }

    public override void OnException(ExceptionContext context)
    {
        foreach (var strategy in _exceptionStrategies)
        {
            if (strategy.CanHandle(context.Exception))
            {
                context.Result = strategy.Handle(context.Exception);
                context.ExceptionHandled = true;
                break;
            }
        }
    }
}