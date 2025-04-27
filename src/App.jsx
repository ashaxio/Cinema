import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMovies from "./pages/AdminMovies";
import NotFound from "./pages/NotFound";
import FilmDataProvider from "./FilmDataProvider.jsx";

function App() {
  return (
    <>
      <FilmDataProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<AdminMovies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </FilmDataProvider>
    </>
  );
}

export default App;
