const BASE_URL = "https://localhost:7175/api/v1";

const endpoints = {
    ALL_RESTAURANTS: `${BASE_URL}/restaurant`,
    RESTAURANT_BY_ID: `${BASE_URL}/restaurant/:restaurantId`,

    ALL_RESTAURANT_TABLES: `${BASE_URL}/restaurant/:restaurantId/table`,
    ADD_RESTAURANT: `${BASE_URL}/restaurant`,
    UPDATE_RESTAURANT: `${BASE_URL}/restaurant/:restaurantId`,
    REMOVE_RESTAURANT: `${BASE_URL}/restaurant/:restaurantId`,

    ALL_RESERVATIONS: `${BASE_URL}/restaurant/:restaurantId/reservation`,
    USER_RESERVATIONS: `${BASE_URL}/user/reservation`,
    ADD_RESERVATION: `${BASE_URL}/restaurant/:restaurantId/table/:tableId/reservation`,
    UPDATE_RESERVATION: `${BASE_URL}/restaurant/:restaurantId/table/:tableId/reservation/:reservationId`,
    REMOVE_RESERVATION: `${BASE_URL}/restaurant/:restaurantId/table/:tableId/reservation/:reservationId`,

    ADD_RESTAURANT_TABLE: `${BASE_URL}/restaurant/:restaurantId/table`,
    UPDATE_RESTAURANT_TABLE: `${BASE_URL}/restaurant/:restaurantId/table/:tableId`,
    REMOVE_RESTAURANT_TABLE: `${BASE_URL}/restaurant/:restaurantId/table/:tableId`,

    LOGIN: `${BASE_URL}/login`,
    REGISTER: `${BASE_URL}/register`,
    LOGOUT: `${BASE_URL}/logout`,
    REFRESH_TOKEN : `${BASE_URL}/refresh`,
};

export default endpoints;