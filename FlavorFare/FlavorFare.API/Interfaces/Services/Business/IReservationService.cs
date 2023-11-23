using FlavorFare.API.Dtos.Reservations;
using System.Security.Claims;

namespace FlavorFare.API.Interfaces.Services.Business
{
    public interface IReservationService
    {
        Task<IEnumerable<ReservationDto>> GetReservationsAsync(int restaurantId, ReservationDateDto reservationDateDto);

        ReservationDto GetReservation(int restaurantId, int tableId, int reservationId);

        Task<IEnumerable<ReservationDto>> GetRestaurantTableReservationsAsync(int restaurantId, int tableId);

        Task<IEnumerable<UserReservationDto>> GetAllUserReservations(ClaimsPrincipal User);

        ReservationDto AddReservation(ClaimsPrincipal currentUser, int restaurantId, int tableId, AddReservationDto addReservationDto);

        Task<ReservationDto> UpdateReservation(ClaimsPrincipal currentUser, int restaurantId, int tableId, int reservationId, UpdateReservationDto updateReservationDto);

        Task RemoveReservation(ClaimsPrincipal currentUser, int restaurantId, int tableId, int reservationId);
    }
}