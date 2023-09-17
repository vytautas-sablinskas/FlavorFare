using AutoMapper;
using FlavorFare.API.Dtos.Reservations;
using FlavorFare.API.Dtos.Restaurants;
using FlavorFare.API.Dtos.Tables;
using FlavorFare.API.Dtos.Users;
using FlavorFare.Data.Entities;

namespace FlavorFare.API.Mappings
{
    public class BiblioNestProfile : Profile
    {
        public BiblioNestProfile()
        {
            CreateMap<Table, TableDto>()
                .ForMember(dest => dest.RestaurantId, opt => opt.MapFrom(src => src.Restaurant.Id));
            CreateMap<AddTableDto, Table>(); 
            CreateMap<UpdateTableDto, Table>();

            CreateMap<Restaurant, RestaurantDto>();
            CreateMap<AddRestaurantDto, Restaurant>();
            CreateMap<UpdateRestaurantDto, Restaurant>();

            CreateMap<Reservation, ReservationDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.TableId, opt => opt.MapFrom(src => src.Table.Id));
            CreateMap<AddReservationDto, Reservation>();
            CreateMap<UpdateReservationDto, Reservation>();

            CreateMap<User, UserDto>();
            CreateMap<AddUserDto, User>();
        }
    }
}