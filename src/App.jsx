import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMovies from "./pages/AdminMovies";
import NotFound from "./pages/NotFound";
import FilmDataProvider from "./FilmDataProvider.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SessionsPage from "./pages/SessionsPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import { AuthProvider } from "./components/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ThemeProvider } from "./components/ThemeContext.jsx";

function App() {
  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.success(toastMessage);
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <FilmDataProvider>
          <Routes>
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:id" element={<MoviePage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminMovies"
              element={
                <ProtectedRoute adminOnly>
                  <AdminMovies />
                </ProtectedRoute>
              }
            />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute onlyOwnProfile={true}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </FilmDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
