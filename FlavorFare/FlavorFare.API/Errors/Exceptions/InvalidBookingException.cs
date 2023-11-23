namespace FlavorFare.API.Errors.Exceptions
{
    public class InvalidBookingException : Exception
    {
        public InvalidBookingException(string message) : base(message)
        {
        }
    }
}
