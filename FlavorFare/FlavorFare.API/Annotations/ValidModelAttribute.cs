using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace FlavorFare.API.Annotations
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                if (context.ModelState.ContainsKey("$"))
                {
                    context.Result = new BadRequestObjectResult(context.ModelState);
                }
                else
                {
                    context.Result = new UnprocessableEntityObjectResult(context.ModelState);
                }
            }
        }
    }
}