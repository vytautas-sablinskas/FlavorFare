namespace FlavorFare.Data.Entities
{
    public class Reservation : BaseEntity
    {
        public Table Table { get; set; }
        public User User { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}