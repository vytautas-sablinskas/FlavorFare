using Microsoft.AspNetCore.Identity;

namespace FlavorFare.Data.Entities
{
    public class FlavorFareUser : IdentityUser
    {
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
    }
}