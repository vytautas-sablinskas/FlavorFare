using FlavorFare.API.Dtos.Tables;
using FlavorFare.API.Interfaces.Services.Business;
using Microsoft.AspNetCore.Mvc;

namespace FlavorFare.API.Controllers
{
    [Route("api/v1")]
    [ApiController]
    public class TableController : ControllerBase
    {
        private readonly ITableService _tableService;

        public TableController(ITableService tableService)
        {
            _tableService = tableService;
        }

        [HttpGet("restaurant/{restaurantId}/table")]
        public async Task<ActionResult<IEnumerable<TableDto>>> GetSelectedRestaurantTablesAsync(int restaurantId)
        {
            var tables = await _tableService.GetTablesByRestaurantId(restaurantId);
            return Ok(tables);
        }

        [HttpGet("restaurant/{restaurantId}/table/{tableId}")]
        public ActionResult<TableDto> GetTable(int restaurantId, int tableId)
        {
            var table = _tableService.GetTable(restaurantId, tableId);
            return Ok(table);
        }

        [HttpPost("restaurant/{restaurantId}/table")]
        public async Task<ActionResult<TableDto>> AddTable(int restaurantId, AddTableDto addTableDto)
        {
            var tableDto = _tableService.AddTable(addTableDto, restaurantId);
            return Created($"restaurant/{restaurantId}/table/{tableDto.Id}", tableDto);
        }

        [HttpPut("restaurant/{restaurantId}/table/{tableId}")]
        public async Task<ActionResult> UpdateTable(int restaurantId, int tableId, UpdateTableDto updateTableDto)
        {
            _tableService.UpdateTable(updateTableDto, tableId, restaurantId);
            return NoContent();
        }

        [HttpDelete("restaurant/{restaurantId}/table/{tableId}")]
        public async Task<ActionResult> RemoveTable(int restaurantId, int tableId)
        {
            _tableService.DeleteTable(restaurantId, tableId);
            return NoContent();
        }
    }
}