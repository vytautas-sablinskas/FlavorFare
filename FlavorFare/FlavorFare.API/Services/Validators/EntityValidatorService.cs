using FlavorFare.API.Interfaces.Services.Validators;
using FlavorFare.Data.Entities;
using FlavorFare.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FlavorFare.API.Services.Validators
{
    public class EntityValidatorService : IEntityValidatorService
    {
        private readonly IRepository<Reservation> _reservationRepository;
        private readonly IRepository<FlavorFareUser> _userRepository;
        private readonly IRepository<Table> _tableRepository;
        private readonly IRepository<Restaurant> _restaurantRepository;

        public EntityValidatorService(IRepository<Reservation> reservationRepository, IRepository<FlavorFareUser> userRepository, IRepository<Table> tableRepository, IRepository<Restaurant> restaurantRepository)
        {
            _reservationRepository = reservationRepository;
            _userRepository = userRepository;
            _tableRepository = tableRepository;
            _restaurantRepository = restaurantRepository;
        }

        public ValidationResult Validate(int? reservationId = null, int? userId = null, int? restaurantId = null, int? tableId = null)
        {
            var validationResult = new ValidationResult();

            var entities = new Dictionary<string, object>();
            var tableNotFoundChecks = new List<(string entityType, Func<object> fetchEntity, int? id)>
            {
                ("Reservation", () => _reservationRepository.FindByCondition(r => r.Id == reservationId.Value).Include(r => r.User).Include(r => r.Table).FirstOrDefault(), reservationId),
                ("User", () => _userRepository.FindByCondition(u => u.Id == userId.Value.ToString()).FirstOrDefault(), userId),
                ("Restaurant", () => _restaurantRepository.FindByCondition(r => r.Id == restaurantId.Value).FirstOrDefault(), restaurantId),
                ("Table", () => _tableRepository.FindByCondition(t => t.Id == tableId.Value).Include(t => t.Restaurant).FirstOrDefault(), tableId)
            };

            foreach (var (entityType, fetchEntity, id) in tableNotFoundChecks)
            {
                if (!id.HasValue)
                {
                    continue;
                }

                var entity = fetchEntity();
                if (entity == null)
                {
                    validationResult.ErrorMessage = $"{entityType} with id {id.Value} was not found.";
                    validationResult.ErrorType = ValidationErrorType.EntityNotFound;
                    validationResult.IsValid = false;

                    return validationResult;
                }

                entities[entityType] = entity;
            }

            var badRequestChecks = new List<(string firstEntity, string secondEntity, Func<object, object, bool> check)>
            {
                ("Table", "Restaurant", (tableObj, restaurantObj) => ((Table)tableObj).Restaurant.Id == ((Restaurant)restaurantObj).Id),
                ("Reservation", "Table", (reservationObj, tableObj) => ((Reservation)reservationObj).Table.Id == ((Table)tableObj).Id),
                ("Reservation", "User", (reservationObj, userObj) => ((Reservation)reservationObj).User.Id == ((FlavorFareUser)userObj).Id)
            };

            foreach (var (firstEntityType, secondEntityType, entitiesMatch) in badRequestChecks)
            {
                if (entities.ContainsKey(firstEntityType) && entities.ContainsKey(secondEntityType))
                {
                    var entity1 = entities[firstEntityType];
                    var entity2 = entities[secondEntityType];

                    if (!entitiesMatch(entity1, entity2))
                    {
                        validationResult.ErrorMessage = $"{firstEntityType} by id '{GetEntityId(entity1)}' does not belong to the {secondEntityType} by id '{GetEntityId(entity2)}'";
                        validationResult.ErrorType = ValidationErrorType.BadRequest;
                        validationResult.IsValid = false;

                        return validationResult;
                    }
                }
            }

            return validationResult;
        }

        private string GetEntityId(object entity)
        {
            string id = "";

            switch (entity)
            {
                case Table table:
                    id = table.Id.ToString();
                    break;

                case Reservation reservation:
                    id = reservation.Id.ToString();
                    break;

                case FlavorFareUser user:
                    id = user.Id.ToString();
                    break;

                case Restaurant restaurant:
                    id = restaurant.Id.ToString();
                    break;
            }

            return id;
        }
    }
}