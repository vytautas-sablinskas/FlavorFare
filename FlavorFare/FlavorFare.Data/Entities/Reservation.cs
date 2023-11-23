using System.ComponentModel.DataAnnotations;

namespace FlavorFare.Data.Entities
{
    public class Reservation : IUserOwnedResource
    {
        public int Id { get; set; }

        public Table Table { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string ExtraInformation { get; set; }

        public FlavorFareUser User { get; set; }

        [Required]
        public string UserId { get; set; }
    }
}