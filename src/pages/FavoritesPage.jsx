import Navbar from "../components/navbar";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { FilmDataContext } from "../FilmDataProvider";
import MovieCard from "../components/MovieCard";

const FavoritesPage = () => {
  const { user } = useContext(AuthContext);
  const { films } = useContext(FilmDataContext);

  if (!user) {
    return (
      <Navbar>
        <div className="text-white p-6">Loading user data...</div>
      </Navbar>
    );
  }

  const favoriteIds = user.favoriteMovies || [];
  const favoriteMovies = films.filter((movie) => favoriteIds.includes(movie.id));

  return (
    <Navbar>
      <div className="p-6">
        {/* Улюблені фільми */}
        <h1 className="text-2xl font-semibold mb-6">Обрані фільми</h1>
        {favoriteMovies.length === 0 ? (
          <p className="text-gray-400">У вас ще немає обраних фільмів.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {favoriteMovies.map((movie) => (
              <MovieCard key={movie.id} id={movie.id} />
            ))}
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default FavoritesPage;