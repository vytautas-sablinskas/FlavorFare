using FlavorFare.API.Dtos.Reservations;
using FlavorFare.API.Interfaces.Services.Business;
using FlavorFare.API.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlavorFare.API.Controllers
{
    [Route("api/v1")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpGet("restaurant/{restaurantId}/reservation")]
        public async Task<IActionResult> GetReservationsAsync(int restaurantId, [FromQuery] ReservationDateDto reservationDateDto)
        {
            var reservations = await _reservationService.GetReservationsAsync(restaurantId, reservationDateDto);
            return Ok(reservations);
        }

        [HttpGet("restaurant/{restaurantId}/table/{tableId}/reservation/{reservationId}")]
        [Authorize(Roles = UserRoles.Admin)]
        public IActionResult GetReservation(int restaurantId, int tableId, int reservationId)
        {
            var reservation = _reservationService.GetReservation(restaurantId, tableId, reservationId);
            return Ok(reservation);
        }

        [HttpGet("restaurant/{restaurantId}/table/{tableId}/reservation")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> GetRestaurantTableReservationsAsync(int restaurantId, int tableId)
        {
            var reservations = await _reservationService.GetRestaurantTableReservationsAsync(restaurantId, tableId);
            return Ok(reservations);
        }

        [HttpGet("user/reservation")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<IActionResult> GetAllUserReservations()
        {
            var reservations = await _reservationService.GetAllUserReservations(User);
            return Ok(reservations);
        }

        [HttpPost("restaurant/{restaurantId}/table/{tableId}/reservation")]
        [Authorize(Roles = UserRoles.User)]
        public IActionResult AddReservation(int restaurantId, int tableId, AddReservationDto addReservationDto)
        {
            var reservation = _reservationService.AddReservation(User, restaurantId, tableId, addReservationDto);
            return Created(nameof(GetReservation), reservation);
        }

        [HttpPut("restaurant/{restaurantId}/table/{tableId}/reservation/{reservationId}")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<IActionResult> UpdateReservation(int restaurantId, int tableId, int reservationId, UpdateReservationDto updateReservationDto)
        {
            var reservation = await _reservationService.UpdateReservation(User, restaurantId, tableId, reservationId, updateReservationDto);
            return Ok(reservation);
        }

        [HttpDelete("restaurant/{restaurantId}/table/{tableId}/reservation/{reservationId}")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<IActionResult> RemoveReservation(int restaurantId, int tableId, int reservationId)
        {
            await _reservationService.RemoveReservation(User, restaurantId, tableId, reservationId);
            return NoContent();
        }
    }
}