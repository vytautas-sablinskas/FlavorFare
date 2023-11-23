using FlavorFare.API.Dtos.Tables;

namespace FlavorFare.API.Interfaces.Services.Business
{
    public interface ITableService
    {
        TableDto AddTable(AddTableDto table, int restaurantId);

        void DeleteTable(int restaurantId, int tableId);

        TableDto GetTable(int restaurantId, int tableId);

        Task<IEnumerable<TableDto>> GetTablesByRestaurantId(int restaurantId);

        TableDto UpdateTable(UpdateTableDto table, int tableId, int restaurantId);
    }
}