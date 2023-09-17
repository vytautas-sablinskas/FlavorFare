using AutoMapper;
using FlavorFare.API.Dtos.Users;
using FlavorFare.API.Interfaces.Services.Business;
using FlavorFare.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FlavorFare.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService authenticationService, IMapper mapper)
        {
            _userService = authenticationService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersAsync()
        {
            var users = await _userService.GetUsersAsync();
            return Ok(users.Select(_mapper.Map<UserDto>));
        }

        [HttpPost]
        public async Task<ActionResult> AddUserAsync(AddUserDto addUserDto)
        {
            var user = _mapper.Map<User>(addUserDto);
            user.HashedPassword = addUserDto.Password;

            _userService.AddUser(user);

            return Created("/user", _mapper.Map<UserDto>(user));
        }
    }
}