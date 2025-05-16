import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UserManagement from "./pages/UserManagement";
import TemplateManagement from "./pages/TemplateManagement";
import AuthLayout from "./components/layouts/AuthLayout";
import MainLayout from "./components/layouts/MainLayout";
import NotFound from "./pages/NotFound";

const AllRoutes = () => {
  const routes = [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/admin",
          children: [
            {
              path: "users",
              element: <UserManagement />,
            },
            {
              path: "templates",
              element: <TemplateManagement />,
            },
          ],
        },
      ],
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];

  return useRoutes(routes);
};

export default AllRoutes;
