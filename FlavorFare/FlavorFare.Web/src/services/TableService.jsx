import endpoints from './API';

export const getTables = async (restaurantId) => {
    const url = endpoints.ALL_RESTAURANT_TABLES.replace(':restaurantId', restaurantId);
    const response = await fetch(url);
    return response.json();
};

export const addTable = async (restaurantId, size) => {
    const url = endpoints.ADD_RESTAURANT_TABLE.replace(':restaurantId', restaurantId);
    const token = localStorage.getItem('accessToken');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ size }),
    });

    return response;
};

export const updateTable = async (restaurantId, tableId, size) => {
    const url = endpoints.UPDATE_RESTAURANT_TABLE.replace(':restaurantId', restaurantId)
                                              .replace(':tableId', tableId);
    const token = localStorage.getItem('accessToken');

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ size }),
    });

    return response;
};

export const removeTable = async (restaurantId, tableId) => {
    const url = endpoints.REMOVE_RESTAURANT_TABLE.replace(':restaurantId', restaurantId)
                                              .replace(':tableId', tableId);
    const token = localStorage.getItem('accessToken');

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    return response;
};