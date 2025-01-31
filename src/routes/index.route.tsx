import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Recipe from "../pages/recipe/Recipe";
import EditRecipe from "../pages/edit_recipe/EditRecipe";
import { AuthProvider } from "../context/AuthContext";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [userId, setUserId] = useState(-1);

  useEffect(() => {
    const idCookie = Cookies.get("id");
    if (idCookie) {
      setUserId(parseInt(idCookie));
    }
  }, []);

  return userId === undefined || userId === null || userId < 0 ? (
    <Login />
  ) : (
    children
  );
};

const LoginRoute = () => {
  const [userId, setUserId] = useState(-1);

  useEffect(() => {
    const idCookie = Cookies.get("id");
    if (idCookie) {
      setUserId(parseInt(idCookie));
    }
  }, []);

  return userId === undefined || userId === null || userId < 0 ? (
    <Login />
  ) : (
    <Navigate to="/" />
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Recipe/:id"
            element={
              <ProtectedRoute>
                <Recipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/NewRecipe"
            element={
              <ProtectedRoute>
                <EditRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Recipe/edit/:id"
            element={
              <ProtectedRoute>
                <EditRecipe />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<h1>404 not found</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
