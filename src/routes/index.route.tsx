import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Recipe from "../pages/recipe/Recipe";
import EditRecipe from "../pages/edit_recipe/EditRecipe";
import { AuthProvider } from "../context/AuthContext";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const idCookie = Cookies.get("id");
    if (idCookie) {
      setUserId(parseInt(idCookie));
    } else {
      setUserId(-1); // Explicitly set to -1 if no cookie is found
    }
  }, []);

  // Avoid rendering children until userId is determined
  if (userId === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return userId < 0 ? <Login /> : children;
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
          <Route path="/" element={<Home />} />
          <Route path="/Recipe/:id" element={<Recipe />} />
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
