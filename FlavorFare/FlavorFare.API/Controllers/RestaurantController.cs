using AutoMapper;
using FlavorFare.API.Dtos.Restaurants;
using FlavorFare.API.Interfaces.Services.Business;
using FlavorFare.API.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlavorFare.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class RestaurantController : ControllerBase
    {
        private readonly IRestaurantService _restaurantService;
        private readonly IMapper _mapper;

        public RestaurantController(IRestaurantService restaurantService, IMapper mapper)
        {
            _restaurantService = restaurantService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RestaurantDto>>> GetRestaurantsAsync()
        {
            var restaurants = await _restaurantService.GetRestaurantsAsync();
            return Ok(restaurants.Select(_mapper.Map<RestaurantDto>));
        }

        [HttpGet]
        [Route("{restaurantId}")]
        public ActionResult<RestaurantDto> GetRestaurant(int restaurantId)
        {
            var restaurant = _restaurantService.GetRestaurant(restaurantId);
            return Ok(restaurant);
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult<RestaurantDto>> AddRestaurant(AddRestaurantDto addRestaurantDto)
        {
            var restaurant = _restaurantService.Add(addRestaurantDto);
            return Created($"/restaurant/{restaurant.Id}", restaurant);
        }

        [HttpPut]
        [Route("{restaurantId}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult> UpdateRestaurant(int restaurantId, UpdateRestaurantDto updateRestaurantDto)
        {
            var restaurant = _restaurantService.Update(restaurantId, updateRestaurantDto);
            return Ok(restaurant);
        }

        [HttpDelete]
        [Route("{restaurantId}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult> RemoveRestaurant(int restaurantId)
        {
            _restaurantService.Delete(restaurantId);
            return NoContent();
        }
    }
}