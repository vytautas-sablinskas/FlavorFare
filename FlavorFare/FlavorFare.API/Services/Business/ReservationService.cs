using AutoMapper;
using FlavorFare.API.Dtos.Reservations;
using FlavorFare.API.Interfaces.Services.Business;
using FlavorFare.API.Interfaces.Services.Validators;
using FlavorFare.Data.Entities;
using FlavorFare.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FlavorFare.API.Services.Business
{
    public class ReservationService : IReservationService
    {
        private readonly IRepository<Reservation> _reservationRepository;
        private readonly IRepository<Table> _tableRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;
        private readonly IEntityValidatorService _entityValidator;

        public ReservationService(
            IRepository<Reservation> reservationRepository,
            IRepository<Table> tableRepository,
            IRepository<User> userRepository,
            IMapper mapper,
            IEntityValidatorService entityValidator)
        {
            _reservationRepository = reservationRepository;
            _tableRepository = tableRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _entityValidator = entityValidator;
        }

        public async Task<IEnumerable<ReservationDto>> GetReservationsAsync()
        {
            var reservations = await _reservationRepository.FindAll()
                                                           .Include(r => r.Table)
                                                           .Include(r => r.User)
                                                           .ToListAsync();

            return reservations.Select(_mapper.Map<ReservationDto>);
        }

        public ReservationDto GetReservation(int restaurantId, int tableId, int reservationId)
        {
            var validationResult = _entityValidator.Validate(restaurantId, tableId, reservationId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var reservation = _reservationRepository.FindByCondition(r => r.Id == reservationId);
            return _mapper.Map<ReservationDto>(reservation);
        }

        public async Task<IEnumerable<ReservationDto>> GetRestaurantTableReservationsAsync(int restaurantId, int tableId)
        {
            var validationResult = _entityValidator.Validate(restaurantId, tableId);
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

        public ReservationDto AddReservation(int restaurantId, int tableId, AddReservationDto addReservationDto)
        {
            var validationResult = _entityValidator.Validate(restaurantId, tableId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var table = _tableRepository.FindByCondition(t => t.Id == tableId).First();
            var user = _userRepository.FindByCondition(u => u.Id == addReservationDto.UserId).First();
            
            var reservation = _mapper.Map<Reservation>(addReservationDto);
            reservation.Table = table;
            reservation.User = user;

            _reservationRepository.Create(reservation);

            return _mapper.Map<ReservationDto>(reservation);
        }

        public void UpdateReservation(int restaurantId, int tableId, int reservationId, UpdateReservationDto updateReservationDto)
        {
            var validationResult = _entityValidator.Validate(restaurantId, tableId, reservationId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var table = _tableRepository.FindByCondition(t => t.Id == tableId).First();
            var user = _userRepository.FindByCondition(u => u.Id == updateReservationDto.UserId).First();

            var reservation = _reservationRepository.FindByCondition(r => r.Id == reservationId).FirstOrDefault();
            _mapper.Map(updateReservationDto, reservation);
            reservation.Table = table;
            reservation.User = user;

            _reservationRepository.Update(reservation);
        }

        public void RemoveReservation(int restaurantId, int tableId, int reservationId)
        {
            var validationResult = _entityValidator.Validate(restaurantId, tableId, reservationId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var reservation = _reservationRepository.FindByCondition(r => r.Id == reservationId).FirstOrDefault();
            _reservationRepository.Delete(reservation);
        }
    }
}