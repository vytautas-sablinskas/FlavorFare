using FlavorFare.API.Errors.Exceptions;

public class ValidationErrorType
{
    public string Name { get; }
    public Type ExceptionType { get; }

    public static ValidationErrorType None = new ValidationErrorType("None", null);
    public static ValidationErrorType EntityNotFound = new ValidationErrorType("EntityNotFound", typeof(EntityNotFoundException));
    public static ValidationErrorType BadRequest = new ValidationErrorType("BadRequest", typeof(InvalidEntityRelationshipException));
    public static ValidationErrorType AuthorizationFailure = new ValidationErrorType("AuthorizationFailure", typeof(ResourceUsageForbiddenException));

    private ValidationErrorType(string name, Type exceptionType)
    {
        Name = name;
        ExceptionType = exceptionType;
    }

    public override string ToString() => Name;
}