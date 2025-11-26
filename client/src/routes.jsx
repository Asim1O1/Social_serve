import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Event from "./pages/Event";

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
        path: '/event/:id',
        element: <Event />

      },
      {
        path: '/me',
        element: <Profile />
      },
      {
        path: '/login',
        element: <Login />
      }, {
        path: '/register',
        element: <Register />
      }
    ]
  }
]);