namespace FlavorFare.Data.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
    }
}