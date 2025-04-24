import React, { useEffect } from 'react';

const Data = () => {
  useEffect(() => {
    fetch('/data/FilmsData.json')
      .then(response => response.json())
      .then(filmData => {
        const updatedFilmData = filmData.map(film => {
          const processedTrailer = film.trailer 
            ? film.trailer
                .replace(/(watch\?v=|youtu.be\/)/, 'embed/')
                .replace(/\/embed\/embed/, '/embed')
            : null;

          const processedCast = film.cast?.map(actor => ({
            ...actor,
            photo: actor.photo 
              ? `/images/${actor.folder || 'cast'}/${actor.photo}`
              : '/images/default-avatar.png'
          })) || [];

          const processedDirector = film.director 
            ? {
                ...film.director,
                photo: film.director.photo
                  ? `/images/directors/${film.director.photo}`
                  : '/images/default-avatar.png'
              }
            : null;
          
          return {
            ...film,
            poster: `/images/posters/${film.poster}`,
            trailer: processedTrailer,
            cast: processedCast,
            director: processedDirector
          };
        });

        console.log("Array Movies:", updatedFilmData);
        window.filmData = updatedFilmData;
      })
      .catch(error => console.error("Error:", error));
  }, []);

  return null;
};

export default Data;