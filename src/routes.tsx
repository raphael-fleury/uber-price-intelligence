import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import PredictPage from "./screens/predict-page";
import SavedRoutesPage from "./screens/saved-routes-page";
import LoginPage from "./screens/login-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <PredictPage />,
      },
      {
        path: "/saved-routes",
        element: <SavedRoutesPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
