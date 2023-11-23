namespace FlavorFare.API.Dtos.Authentication
{
    public record SuccessfulLoginDto(string AccessToken, string RefreshToken);
}