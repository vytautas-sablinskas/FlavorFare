using AutoMapper;
using FlavorFare.API.Dtos.Reservations;
using FlavorFare.API.Dtos.Restaurants;
using FlavorFare.API.Dtos.Tables;
using FlavorFare.Data.Entities;

namespace FlavorFare.API.Mappings
{
    public class FlavorFareProfile : Profile
    {
        public FlavorFareProfile()
        {
            CreateMap<Table, TableDto>()
                .ForMember(dest => dest.RestaurantId, opt => opt.MapFrom(src => src.Restaurant.Id));
            CreateMap<AddTableDto, Table>();
            CreateMap<UpdateTableDto, Table>();

            CreateMap<Restaurant, RestaurantDto>();
            CreateMap<AddRestaurantDto, Restaurant>();
            CreateMap<UpdateRestaurantDto, Restaurant>();

            CreateMap<Reservation, ReservationDto>()
                .ForMember(dest => dest.TableId, opt => opt.MapFrom(src => src.Table.Id));
            CreateMap<Reservation, UserReservationDto>()
                .ForCtorParam("Id", opt => opt.MapFrom(src => src.Id))
                .ForCtorParam("TableId", opt => opt.MapFrom(src => src.Table.Id))
                .ForCtorParam("RestaurantId", opt => opt.MapFrom(src => src.Table.Restaurant.Id))
                .ForCtorParam("RestaurantName", opt => opt.MapFrom(src => src.Table.Restaurant.Name))
                .ForCtorParam("StartTime", opt => opt.MapFrom(src => src.StartTime))
                .ForCtorParam("EndTime", opt => opt.MapFrom(src => src.EndTime))
                .ForCtorParam("ExtraInformation", opt => opt.MapFrom(src => src.ExtraInformation));

            CreateMap<AddReservationDto, Reservation>();
            CreateMap<UpdateReservationDto, Reservation>();
        }
    }
}