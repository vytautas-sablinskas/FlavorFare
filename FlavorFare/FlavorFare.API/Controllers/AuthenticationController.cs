using FlavorFare.API.Dtos.Authentication;
using FlavorFare.API.Interfaces.Authentication;
using FlavorFare.API.Roles;
using FlavorFare.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlavorFare.API.Controllers
{
    [Route("api/v1/")]
    [ApiController]
    [AllowAnonymous]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<FlavorFareUser> _userManager;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthenticationController(UserManager<FlavorFareUser> userManager, IJwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterUserDto registerUserDto)
        {
            var user = await _userManager.FindByNameAsync(registerUserDto.UserName);
            if (user != null)
                return BadRequest("Username is already taken!");

            var newUser = new FlavorFareUser
            {
                Email = registerUserDto.Email,
                UserName = registerUserDto.UserName,
            };

            var createdResult = await _userManager.CreateAsync(newUser, registerUserDto.Password);
            if (!createdResult.Succeeded)
                return BadRequest("Could not create a user.");

            await _userManager.AddToRoleAsync(newUser, UserRoles.User);

            return CreatedAtAction(nameof(Register), new UserDto(newUser.Id, newUser.UserName, newUser.Email));
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserName);
            if (user == null)
                return BadRequest("Username or password is invalid");

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordValid)
                return BadRequest("Username or password is invalid");

            var roles = await _userManager.GetRolesAsync(user);
            var (accessToken, refreshToken) = _jwtTokenService.CreateTokens(user.UserName, user.Id, roles);

            return Ok(new SuccessfulLoginDto(accessToken, refreshToken));
        }

        [HttpPost]
        [Route("logout")]
        public IActionResult Logout([FromBody] RefreshTokenDto tokenDto)
        {
            if (string.IsNullOrEmpty(tokenDto.RefreshToken))
                return BadRequest("Refresh token is required.");

            var tokenWasRevoked = _jwtTokenService.RevokeToken(tokenDto.RefreshToken);
            if (!tokenWasRevoked)
                return BadRequest("Invalid token or token not found.");

            return Ok("Successfully logged out.");
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto tokenDto)
        {
            if (string.IsNullOrEmpty(tokenDto.RefreshToken))
                return BadRequest("Refresh token is required.");

            var refreshedTokens = await _jwtTokenService.RefreshTokensAsync(_userManager, tokenDto.RefreshToken);

            if (refreshedTokens == null)
            {
                return BadRequest("Invalid or expired refresh token");
            }

            var refreshedInformation = new SuccessfulLoginDto(AccessToken: refreshedTokens.Value.AccessToken,
                                           RefreshToken: refreshedTokens.Value.RefreshToken);
            return Ok(refreshedInformation);
        }
    }
}