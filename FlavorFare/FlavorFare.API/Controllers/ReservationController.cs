using FlavorFare.API.Dtos.Reservations;
using FlavorFare.API.Interfaces.Services.Business;
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

        [HttpGet("reservation")]
        public async Task<IActionResult> GetReservationsAsync()
        {
            var reservations = await _reservationService.GetReservationsAsync();
            return Ok(reservations);
        }

        [HttpGet("restaurant/{restaurantId}/table/{tableId}/reservation/{reservationId}")]
        public IActionResult GetReservation(int restaurantId, int tableId, int reservationId)
        {
            var reservation = _reservationService.GetReservation(restaurantId, tableId, reservationId);
            return Ok(reservation);
        }

        [HttpGet("restaurant/{restaurantId}/table/{tableId}/reservation")]
        public async Task<IActionResult> GetRestaurantTableReservationsAsync(int restaurantId, int tableId)
        {
            var reservations = await _reservationService.GetRestaurantTableReservationsAsync(restaurantId, tableId);
            return Ok(reservations);
        }

        [HttpPost("restaurant/{restaurantId}/table/{tableId}/reservation")]
        public IActionResult AddReservation(int restaurantId, int tableId, AddReservationDto addReservationDto)
        {
            var reservation = _reservationService.AddReservation(restaurantId, tableId, addReservationDto);
            return CreatedAtAction(nameof(GetReservation), new { restaurantId, tableId, reservationId = reservation.Id }, reservation);
        }

        [HttpPut("restaurant/{restaurantId}/table/{tableId}/reservation/{reservationId}")]
        public IActionResult UpdateReservation(int restaurantId, int tableId, int reservationId, UpdateReservationDto updateReservationDto)
        {
            _reservationService.UpdateReservation(restaurantId, tableId, reservationId, updateReservationDto);
            return NoContent();
        }

        [HttpDelete("restaurant/{restaurantId}/table/{tableId}/reservation/{reservationId}")]
        public IActionResult RemoveReservation(int restaurantId, int tableId, int reservationId)
        {
            _reservationService.RemoveReservation(restaurantId, tableId, reservationId);
            return NoContent();
        }
    }
}