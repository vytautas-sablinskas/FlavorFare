﻿namespace FlavorFare.Data.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; } = false;
        public string UserId { get; set; }
        public virtual FlavorFareUser User { get; set; }
    }
}