namespace FlavorFare.API.Dtos.Reservations
{
    public record UserReservationDto(
        int Id,
        int TableId,
        int RestaurantId,
        string RestaurantName,
        DateTime StartTime,
        DateTime EndTime,
        string ExtraInformation
    );
}
