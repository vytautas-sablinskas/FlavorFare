using FlavorFare.API.Errors.Exceptions;

public class ValidationErrorType
{
    public string Name { get; }
    public Type ExceptionType { get; }

    public static ValidationErrorType None = new ValidationErrorType("None", null);
    public static ValidationErrorType EntityNotFound = new ValidationErrorType("EntityNotFound", typeof(EntityNotFoundException));
    public static ValidationErrorType BadRequest = new ValidationErrorType("BadRequest", typeof(InvalidEntityRelationshipException));

    private ValidationErrorType(string name, Type exceptionType)
    {
        Name = name;
        ExceptionType = exceptionType;
    }

    public override string ToString() => Name;
}