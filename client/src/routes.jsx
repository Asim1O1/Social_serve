import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Event from "./pages/Event";
import CreateCampain from "./pages/CreateCampain";
import ForgotPassword from "./pages/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/forgotpassword',
        element: <ForgotPassword />
      },

      {
        path: '/event/:id',
        element: <Event />

      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/create-campain',
        element: <CreateCampain />
      }
    ]
  }
]);