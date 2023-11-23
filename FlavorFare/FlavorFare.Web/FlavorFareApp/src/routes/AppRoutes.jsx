import Restaurants from "../components/Restaurants/index";
import UserReservations from "../components/Reservations/user-reservations";
import TablesWrapper from "../components/Wrappers/TablesWrapper";
import LoginPage from "../components/Authentication/LoginPage";
import RegistrationPage from "../components/Authentication/RegisterPage";
import AdminRestaurants from "../components/Restaurants/admin-restaurant";

const AppRoutes = [
  {
    index: true,
    element: <Restaurants />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegistrationPage />
  },
  {
    path: '/restaurant/:restaurantId',
    element: <TablesWrapper />
  },
  {
    path: '/user/reservations',
    element: <UserReservations />
  },
  {
    path: '/admin/restaurants',
    element: <AdminRestaurants />
  }
];

export default AppRoutes;