import "../MoviePageTemp.css";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate for programmatic navigation
import { FilmDataContext } from "../FilmDataProvider";

const formatMovieRating = (movieRating, userRating) => {
  let generalMovieRating;
  if (userRating) {
    generalMovieRating = (movieRating + userRating) / 2;
  } else {
    generalMovieRating = movieRating;
  }
  return Math.round(generalMovieRating * 10) / 10;
};

const MoviePage = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation
  const movieId = useParams().id;
  const { films, loading } = useContext(FilmDataContext);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (films.length > 0) setMovie(films.find((f) => f.id == movieId));
  }, [films, movieId]);

  if (loading) return <h1>Loading...</h1>;

  const addMovieRating = (formData) => {
    const ratingData = {
      id: movieId,
      user: "Guest", //Change in the future
      rating: parseFloat(formData.get("rating")),
    };

    fetch("http://localhost:3000/movies/add-rating", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ratingData),
    }).catch((err) => console.error(err));

    window.location.reload();
  };

  return (
    <div className="movie-page-container">
      {movie ? (
        <>
          {/* Button for navigating to Home */}
          <div className="relative">
            <button
              onClick={() => navigate("/")} // Navigate to the Home page
              className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-[#5031D6] hover:bg-[#6a4ff7] transition-colors"
            >
              Go to Home
            </button>
          </div>

          {/* Movie content */}
          <div className="movie-content">
            <h1>{movie.title}</h1>
            <img
              className="movie-poster"
              src={movie.poster}
              alt={`Poster for ${movie.title}`}
            />
            <p>{`Рейтинг: ${formatMovieRating(movie.rating, movie.userRating)}`}</p>
            <p>{`Дата випуску: ${movie.release_date}`}</p>
            <div>
              <h2>Опис: </h2>
              <p>{movie.description}</p>
            </div>
            <div>
              <h2>Жанр: </h2>
              <p>{movie.genre.join(" | ")}</p>
            </div>
            <div>
              <h2>Дивитись трейлер</h2>
              <iframe
                src={movie.trailer}
                title="Трейлер"
                allowFullScreen
                className="movie-trailer"
              ></iframe>
            </div>
            <div>
              <h2>Продюсер та акторський склад:</h2>
              <h3>{`Продюсер: ${movie.director.name}`}</h3>
              <img
                className="producer-photo"
                src={movie.director.photo}
                alt={`Picture of ${movie.director.name}`}
              />

              <div className="cast">
                {movie.cast.map((actor) => (
                  <div key={actor.name} className="actor-card">
                    <img
                      className="actor-photo"
                      src={actor.photo}
                      alt={`Picture of ${actor.name}`}
                    />
                    <div className="actor-info">
                      <h4>{actor.name}</h4>
                      <p>{`Роль: ${actor.role}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <form action={addMovieRating}>
                <label htmlFor="rating">Ваш рейтинг: </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  name="rating"
                  id="rating"
                  required
                />
                <input type="submit" value="Надіслати" />
              </form>
            </div>
            <div>
              {movie.ratings ? (
                movie.ratings.map((rating, i) => (
                  <div className="user-rating" key={i}>
                    <h5>{rating.user}</h5>
                    <p>{`Ретинг: ${rating.rating}`}</p>
                  </div>
                ))
              ) : (
                <h4>Рейтинги користувачів відсутні!</h4>
              )}
            </div>
          </div>
        </>
      ) : (
        <h1>ERROR 404: PAGE NOT FOUND!</h1>
      )}
    </div>
  );
};

export default MoviePage;
