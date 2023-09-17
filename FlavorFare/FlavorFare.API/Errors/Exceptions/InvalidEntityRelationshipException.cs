namespace FlavorFare.API.Errors.Exceptions
{
    public class InvalidEntityRelationshipException : Exception
    {
        public InvalidEntityRelationshipException(string message) : base(message) { }
    }
}