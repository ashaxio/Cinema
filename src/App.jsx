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
import { AuthProvider } from "./components/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";

function App() {
  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.success(toastMessage);
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  return (
    <AuthProvider>
      <FilmDataProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<AdminMovies />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </FilmDataProvider>
    </AuthProvider>
  );
}

export default App;
