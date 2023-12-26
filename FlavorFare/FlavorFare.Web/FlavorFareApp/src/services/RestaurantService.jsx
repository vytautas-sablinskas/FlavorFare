import endpoints from './API';

export const getRestaurants = async () => {
    const response = await fetch(endpoints.ALL_RESTAURANTS);
    const data = await response.json();
    return data;
};

export const getRestaurantById = async (restaurantId) => {
    const response = await fetch(endpoints.RESTAURANT_BY_ID.replace(':restaurantId', restaurantId));
    return response.json();
};

export const addRestaurant = async (restaurant) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(endpoints.ADD_RESTAURANT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: restaurant.name,
            address: restaurant.address,
            openingTime: restaurant.openingTime,
            closingTime: restaurant.closingTime,
            intervalBetweenBookings: restaurant.intervalBetweenBookings
        })
    })

    return response;
} 

export const updateRestaurant = async (restaurantId, updatedData) => {
    const token = localStorage.getItem('accessToken');
    const url = endpoints.UPDATE_RESTAURANT.replace(':restaurantId', restaurantId)
    console.log(updatedData);

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: updatedData.name,
            address: updatedData.address,
            openingTime: updatedData.openingTime,
            closingTime: updatedData.closingTime,
            intervalBetweenBookings: updatedData.intervalBetweenBookings
        })
    });

    return response;
}

export const removeRestaurant = async (restaurantId) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(endpoints.REMOVE_RESTAURANT.replace(':restaurantId', restaurantId), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    return response;
}