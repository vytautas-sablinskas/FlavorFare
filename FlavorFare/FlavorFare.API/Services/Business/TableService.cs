using AutoMapper;
using FlavorFare.API.Dtos.Tables;
using FlavorFare.API.Interfaces.Services.Business;
using FlavorFare.API.Interfaces.Services.Validators;
using FlavorFare.Data.Entities;
using FlavorFare.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FlavorFare.API.Services.Business
{
    public class TableService : ITableService
    {
        private readonly IRepository<Table> _tableRepository;
        private readonly IRepository<Restaurant> _restaurantRepository;
        private readonly IEntityValidatorService _entityValidator;
        private readonly IMapper _mapper;

        public TableService(
            IRepository<Table> tableRepository,
            IRepository<Restaurant> restaurantRepository,
            IEntityValidatorService entityValidator,
            IMapper mapper)
        {
            _tableRepository = tableRepository;
            _restaurantRepository = restaurantRepository;
            _entityValidator = entityValidator;
            _mapper = mapper;
        }

        public TableDto AddTable(AddTableDto addTableDto, int restaurantId)
        {
            var validationResult = _entityValidator.Validate(restaurantId: restaurantId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var restaurant = _restaurantRepository.FindByCondition(r => r.Id == restaurantId).FirstOrDefault();
            var table = _mapper.Map<Table>(addTableDto);
            table.Restaurant = restaurant;

            _tableRepository.Create(table);

            return _mapper.Map<TableDto>(table);
        }

        public void DeleteTable(int restaurantId, int tableId)
        {
            var validationResult = _entityValidator.Validate(restaurantId: restaurantId, tableId: tableId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var table = _tableRepository.FindByCondition(t => t.Id == tableId).FirstOrDefault();
            _tableRepository.Delete(table);
        }

        public TableDto GetTable(int restaurantId, int tableId)
        {
            var validationResult = _entityValidator.Validate(restaurantId: restaurantId, tableId: tableId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var table = _tableRepository.FindByCondition(t => t.Id == tableId)
                                   .Include(r => r.Restaurant)
                                   .FirstOrDefault();

            return _mapper.Map<TableDto>(table);
        }

        public async Task<IEnumerable<TableDto>> GetTablesByRestaurantId(int restaurantId)
        {
            var validationResult = _entityValidator.Validate(restaurantId: restaurantId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var tables = await _tableRepository.FindByCondition(t => t.Restaurant.Id == restaurantId)
                                   .Include(r => r.Restaurant)
                                   .ToListAsync();
            return tables.Select(_mapper.Map<TableDto>);
        }

        public void UpdateTable(UpdateTableDto updateTableDto, int tableId, int restaurantId)
        {
            var validationResult = _entityValidator.Validate(tableId: tableId, restaurantId: restaurantId);
            if (!validationResult.IsValid)
            {
                throw validationResult.GetException();
            }

            var restaurant = _restaurantRepository.FindByCondition(r => r.Id == restaurantId).FirstOrDefault();
            var tableToUpdate = _mapper.Map<Table>(updateTableDto);
            tableToUpdate.Restaurant = restaurant;

            _tableRepository.Update(tableToUpdate);
        }
    }
}