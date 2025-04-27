import React, { createContext, useState, useEffect } from 'react';

// React context creation
export const FilmDataContext = createContext();

const FilmDataProvider = ({ children }) => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/FilmsData.json')
      .then((response) => response.json())
      .then((filmData) => {
        const updatedFilmData = filmData.map((film) => {
          const processedTrailer = film.trailer
            ? film.trailer
                .replace(/(watch\?v=|youtu.be\/)/, 'embed/')
                .replace(/\/embed\/embed/, '/embed')
            : null;

          const processedCast =
            film.cast?.map((actor) => ({
              ...actor,
              photo: actor.photo
                ? `/images/cast/${actor.folder}/${actor.photo}`
                : '/images/default-avatar.png',
            })) || [];

          const processedDirector = film.director
            ? {
                ...film.director,
                photo: film.director.photo
                  ? `/images/directors/${film.director.photo}`
                  : '/images/default-avatar.png',
              }
            : null;

          return {
            ...film,
            poster: `/images/posters/${film.poster}`,
            trailer: processedTrailer,
            cast: processedCast,
            director: processedDirector,
          };
        });
        console.log('Array movies:', updatedFilmData);

        setFilms(updatedFilmData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  return (
    <FilmDataContext.Provider value={{ films, loading }}>
      {children}
    </FilmDataContext.Provider>
  );
};

export default FilmDataProvider;
