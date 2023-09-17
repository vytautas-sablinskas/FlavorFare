namespace FlavorFare.API.Errors.Exceptions
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException(string message) : base(message)
        {
        }
    }
}