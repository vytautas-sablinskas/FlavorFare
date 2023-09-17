namespace FlavorFare.Data.Entities
{
    public class Table : BaseEntity
    {
        public Restaurant Restaurant { get; set; }
        public int Size { get; set; }
    }
}