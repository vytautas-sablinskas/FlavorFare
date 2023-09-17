public class EntityValidationResult
{
    public bool IsValid { get; set; } = true;
    public string ErrorMessage { get; set; }
    public ValidationErrorType ErrorType { get; set; } = ValidationErrorType.None;

    public Exception GetException()
    {
        if (ErrorType?.ExceptionType != null)
        {
            return (Exception)Activator.CreateInstance(ErrorType.ExceptionType, ErrorMessage);
        }
        return null;
    }
}