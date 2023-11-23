namespace FlavorFare.API.Dtos.Reservations
{
    public record ReservationDto(
        int Id,
        int TableId,
        DateTime StartTime,
        DateTime EndTime,
        string ExtraInformation
    );
}