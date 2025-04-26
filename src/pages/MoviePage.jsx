import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FilmDataContext } from "../FilmDataProvider";

const MoviePage = () => {
  const movieId = useParams().id;
  const { films, loading } = useContext(FilmDataContext);
  const [film, setFilm] = useState(null);

  useEffect(() => {
    if (films.length > 0) setFilm(films.find(f => f.id == movieId));
  }, [films, movieId]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      {film ?
        <>
          <h1>{film.title}</h1>
          <img src={film.poster} alt={`Poster for ${film.title}`} />
          <p>{`Рейтинг: ${film.rating}`}</p>
          <p>{`Дата випуску: ${film.release_date}`}</p>

          <div>
            <h2>Опис: </h2>
            <p>{film.description}</p>
          </div>

          <div>
            <h2>Жанр: </h2>
            <p>{film.genre.join(" | ")}</p>
          </div>

          <div>
            <h2>Дивитись трейлер</h2>
            <iframe src={film.trailer}
              title="Трейлер"
              allowFullScreen
            ></iframe>
          </div>

          <div>
            <h2>Продюсер та акторський склад:</h2>
            <h3>{`Продюсер: ${film.director.name}`}</h3>
            <img src={film.director.photo} alt={`Picture of ${film.director.name}`} />

            <div>
              {film.cast.map(actor => (
                <div key={actor.name}>
                  <img src={actor.photo} alt={`Picture of ${actor.name}`} />
                  <h4>{actor.name}</h4>
                  <p>{`Роль: ${actor.role}`}</p>
                </div>
              ))}
            </div>
          </div>
        </>

        : <h1>ERROR 404: NOT FOUND!</h1>
      }
    </>
  );
};

export default MoviePage;