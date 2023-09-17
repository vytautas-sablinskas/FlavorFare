using FlavorFare.API.Dtos.Tables;
using FlavorFare.Data.Entities;
using System.Collections.Generic;

namespace FlavorFare.API.Interfaces.Services.Business
{
    public interface ITableService
    {
        TableDto AddTable(AddTableDto table, int restaurantId);
        void DeleteTable(int restaurantId, int tableId);
        TableDto GetTable(int restaurantId, int tableId);
        Task<IEnumerable<TableDto>> GetTablesByRestaurantId(int restaurantId);
        void UpdateTable(UpdateTableDto table, int tableId, int restaurantId);
    }
}