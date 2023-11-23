using AutoMapper;
using FlavorFare.API.Dtos.Reservations;
using FlavorFare.API.Errors.Exceptions;
using FlavorFare.API.Interfaces.Services.Business;
using FlavorFare.API.Interfaces.Services.Validators;
using FlavorFare.API.Policies;
using FlavorFare.Data.Entities;
using FlavorFare.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Globalization;
using System.Security.Claims;

namespace FlavorFare.API.Services.Business
{
    public class ReservationService : IReservationService
    {
        private readonly IRepository<Reservation> _reservationRepository;
        private readonly IRepository<Table> _tableRepository;
        private readonly IRepository<FlavorFareUser> _userRepository;
        private readonly IMapper _mapper;
        private readonly IEntityValidatorService _entityValidator;
        private readonly IAuthorizationService _authorizationService;

        public ReservationService(
            IRepository<Reservation> reservationRepository,
            IRepository<Table> tableRepository,
            IRepository<FlavorFareUser> userRepository,
            IMapper mapper,
            IEntityValidatorService entityValidator,
            IAuthorizationService authorizationService)
        {
            _reservationRepository = reservationRepository;
            _tableRepository = tableRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _entityValidator = entityValidator;
            _authorizationService = authorizationService;
        }

        public async Task<IEnumerable<ReservationDto>> GetReservationsAsync(int restaurantId, ReservationDateDto reservationDateDto)
        {
            var validationResult = _entityValidator.Validate(restaurantId: restaurantId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var tableIdsByRestaurantId = await _tableRepository.FindByCondition(t => t.Restaurant.Id == restaurantId).Select(t => t.Id).ToListAsync();

            var reservations = await _reservationRepository.FindAll()
                                                           .Include(r => r.Table)
                                                           .Include(r => r.User)
                                                           .Where(r => r.StartTime.Date == reservationDateDto.DateTime.Date &&
                                                                                           tableIdsByRestaurantId.Contains(r.Table.Id))
                                                           .ToListAsync();

            return reservations.Select(_mapper.Map<ReservationDto>);
        }

        public ReservationDto GetReservation(int restaurantId, int tableId, int reservationId)
        {
            var validationResult = _entityValidator.Validate(restaurantId: restaurantId, tableId: tableId, reservationId: reservationId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var reservation = _reservationRepository.FindByCondition(r => r.Id == reservationId).FirstOrDefault();
            return _mapper.Map<ReservationDto>(reservation);
        }

        public async Task<IEnumerable<ReservationDto>> GetRestaurantTableReservationsAsync(int restaurantId, int tableId)
        {
            var validationResult = _entityValidator.Validate(restaurantId: restaurantId, tableId: tableId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var reservations = await _reservationRepository.FindAll()
                                                     .Where(r => r.Table.Id == tableId)
                                                     .Include(r => r.Table)
                                                     .Include(r => r.User)
                                                     .ToListAsync();

            return reservations.Select(_mapper.Map<ReservationDto>);
        }

        public ReservationDto AddReservation(ClaimsPrincipal currentUser, int restaurantId, int tableId, AddReservationDto addReservationDto)
        {
            var validationResult = _entityValidator.Validate(restaurantId: restaurantId, tableId: tableId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var table = _tableRepository.FindByCondition(t => t.Id == tableId).First();
            var userId = currentUser.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var user = _userRepository.FindByCondition(u => u.Id == userId).First();

            var overlappingReservation = _reservationRepository.FindByCondition(r =>
                r.UserId == userId &&
                r.EndTime > addReservationDto.StartTime &&
                r.StartTime < addReservationDto.EndTime).FirstOrDefault();

            if (overlappingReservation != null)
            {
                throw new InvalidBookingException("You already have a booking that overlaps with this time slot.");
            }

            var currentDateTime = DateTime.UtcNow;
            var activeReservationsCount = _reservationRepository.FindByCondition(r =>
                r.UserId == userId &&
                r.EndTime > currentDateTime).Count();

            if (activeReservationsCount >= 3)
            {
                throw new InvalidBookingException("You have reached the maximum number of active bookings.");
            }

            var reservation = _mapper.Map<Reservation>(addReservationDto);
            reservation.Table = table;
            reservation.User = user;
            reservation.UserId = userId;

            _reservationRepository.Create(reservation);

            return _mapper.Map<ReservationDto>(reservation);
        }

        public async Task<ReservationDto> UpdateReservation(ClaimsPrincipal currentUser, int restaurantId, int tableId, int reservationId, UpdateReservationDto updateReservationDto)
        {
            var validationResult = _entityValidator.Validate(restaurantId: restaurantId, tableId: tableId, reservationId: reservationId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var reservation = _reservationRepository.FindByCondition(r => r.Id == reservationId).FirstOrDefault();

            var authorizationResult = await _authorizationService.AuthorizeAsync(currentUser, reservation, PolicyNames.ResourceOwner);
            if (!authorizationResult.Succeeded)
            {
                throw new ResourceUsageForbiddenException();
            }

            var table = _tableRepository.FindByCondition(t => t.Id == tableId).FirstOrDefault();
            var user = _userRepository.FindByCondition(u => u.Id == currentUser.FindFirstValue(JwtRegisteredClaimNames.Sub)).First();

            _mapper.Map(updateReservationDto, reservation);
            reservation.Table = table;
            reservation.User = user;

            _reservationRepository.Update(reservation);

            return _mapper.Map<ReservationDto>(reservation);
        }

        public async Task RemoveReservation(ClaimsPrincipal currentUser, int restaurantId, int tableId, int reservationId)
        {
            var validationResult = _entityValidator.Validate(restaurantId: restaurantId, tableId: tableId, reservationId: reservationId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var reservation = _reservationRepository.FindByCondition(r => r.Id == reservationId).FirstOrDefault();

            var authorizationResult = await _authorizationService.AuthorizeAsync(currentUser, reservation, PolicyNames.ResourceOwner);
            if (!authorizationResult.Succeeded)
            {
                throw new ResourceUsageForbiddenException();
            }

            _reservationRepository.Delete(reservation);
        }

        private string GetRestaurantNameFromTableId(int tableId)
        {
            var table = _tableRepository.FindByCondition(t => t.Id == tableId).Include(t => t.Restaurant).FirstOrDefault();
            return table.Restaurant.Name;
        }

        public async Task<IEnumerable<UserReservationDto>> GetAllUserReservations(ClaimsPrincipal User)
        {
            var reservations = await _reservationRepository.FindAll()
                                                     .Where(r => r.UserId == User.FindFirstValue(JwtRegisteredClaimNames.Sub))
                                                     .Include(r => r.Table)
                                                     .ThenInclude(t => t.Restaurant)
                                                     .Include(r => r.User)
                                                     .ToListAsync();

            return reservations.Select(_mapper.Map<UserReservationDto>);
        }
    }
}