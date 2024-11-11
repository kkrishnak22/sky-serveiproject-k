import React, { useState } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CircularProgress, Box } from "@mui/material";

import theme from "./theme/theme"; 

import Body from "./components/Body/Body";
import Header from "./components/Header/Header";
import Error from "./components/Error/Error";

import Area from "./components/Map/Area";
import Distance from "./components/Map/Distance";
import Marker from "./components/Map/Marker";
import DragMarkerSidebar from "./components/Sidebar/DragMarkerSidebar";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import GuestRoute from "./components/Auth/GuestRoute";
import { AuthProvider, useAuth } from "./components/Auth/AuthContext";
import { AreaProvider, useArea } from "./components/Sidebar/AreaContext";

const AppLayout = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  return (
    <div className="main-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
      />
      <Outlet />
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState("layers");

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AppLayout activeTab={activeTab} setActiveTab={setActiveTab} />
        </ProtectedRoute>
      ),
      children: [
        { path: "/",  element: (<Body />) },
        { path: "/area", element: <Area /> },
        { path: "/distance", element: <Distance /> },
        { path: "/marker", element: <Marker /> },
        { path: "/drag_marker", element: <DragMarkerSidebar /> },
      ],
      errorElement: <Error />,
    },
    {
      path: "/login",
      element: (
        <GuestRoute>
          <Login />
        </GuestRoute>
      ),
    },
   
  ]);

  return (
    <AuthProvider>
      <AreaProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={appRouter} />
        </ThemeProvider>
      </AreaProvider>
    </AuthProvider>
  );
}

export default App;
