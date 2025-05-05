import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Recipe from "../pages/recipe/Recipe";
import CalendarPage from "../pages/calendar/CalendarPage";
import EditRecipe from "../pages/edit_recipe/EditRecipe";
import { AuthProvider } from "../context/AuthContext";
import Cookies from "js-cookie";
import DatePage from "../pages/date/DatePage";
import ShoppingList from "../pages/shopping_list/ShoppingList";
import EditExternalRecipe from "../pages/edit_external_recipe/EditExternalRecipe";
import Recipes from "../pages/recipes/Recipes";
import ErrorPage from "../pages/error_page/ErrorPage";

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
          <Route path="/Recipes" element={<Recipes />} />
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
          <Route
            path="/Calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ShoppingList"
            element={
              <ProtectedRoute>
                <ShoppingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Date/:day/:month/:year"
            element={
              <ProtectedRoute>
                <DatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/NewExternalRecipe"
            element={
              <ProtectedRoute>
                <EditExternalRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EditExternalRecipe/:id"
            element={
              <ProtectedRoute>
                <EditExternalRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<ErrorPage message="404 - Page not found" returnToHome />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
