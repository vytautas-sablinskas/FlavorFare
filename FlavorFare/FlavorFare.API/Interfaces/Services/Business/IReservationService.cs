using FlavorFare.API.Dtos.Reservations;

namespace FlavorFare.API.Interfaces.Services.Business
{
    public interface IReservationService
    {
        Task<IEnumerable<ReservationDto>> GetReservationsAsync();

        ReservationDto GetReservation(int restaurantId, int tableId, int reservationId);

        Task<IEnumerable<ReservationDto>> GetRestaurantTableReservationsAsync(int restaurantId, int tableId);

        ReservationDto AddReservation(int restaurantId, int tableId, AddReservationDto addReservationDto);

        void UpdateReservation(int restaurantId, int tableId, int reservationId, UpdateReservationDto updateReservationDto);

        void RemoveReservation(int restaurantId, int tableId, int reservationId);
    }
}