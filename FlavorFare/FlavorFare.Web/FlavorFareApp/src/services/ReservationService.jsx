import endpoints from './API';

const addReservationFetch = async (restaurantId, tableId, startTime, endTime, extraInformation) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(endpoints.ADD_RESERVATION.replace(':restaurantId', restaurantId)
                                                          .replace(':tableId', tableId), 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ startTime, endTime, extraInformation: extraInformation || "" })
    });

    return response
};

export const addReservation = async (restaurantId, tableId, startTime, endTime, extraInformation) => {
    try {
        const response = await addReservationFetch(restaurantId, tableId, startTime, endTime, extraInformation);
        if (response.status === 400) {
            const message = await response.text();

            return { success: 'error', message: message };
        }

        return { success: 'success', message: 'Table booked successfully!' };
    } catch (error) {
        return { success: 'error', message: 'Error booking the table. Please try again.' };
    }
}

export const getReservations = async (date, restaurantId) => {
    const url = new URL(endpoints.ALL_RESERVATIONS.replace(':restaurantId', restaurantId));
    url.searchParams.append('datetime', date);

    const response = await fetch(url);
    return response.json();
}

export const getUserReservations = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(endpoints.USER_RESERVATIONS, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })

    return response.json();
}

export const updateUserReservation = async (restaurantId, tableId, reservationId, extraInformation) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(endpoints.UPDATE_RESERVATION.replace(':restaurantId', restaurantId)
                                                             .replace(':tableId', tableId)
                                                             .replace(':reservationId', reservationId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ extraInformation: extraInformation || "" })
    })

    return response;
}

export const removeUserReservation = async (restaurantId, tableId, reservationId) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(endpoints.REMOVE_RESERVATION.replace(':restaurantId', restaurantId)
                                                            .replace(':tableId', tableId)
                                                            .replace(':reservationId', reservationId), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })

    return response;
}