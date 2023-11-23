import endpoints from './API';

export const getTables = async (restaurantId) => {
    const url = endpoints.ALL_RESTAURANT_TABLES.replace(':restaurantId', restaurantId);
    const response = await fetch(url);
    return response.json();
};