import fs from 'fs/promises';

export async function getMovies() {
  try {
    const data = await fs.readFile('../data/FilmsData.json', 'utf-8');
    const movies = JSON.parse(data);

    return movies;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addRatingToMovie(movieData) {
  try {
    const movies = await getMovies();

    //Finding movie by id
    const movieId = movies.findIndex(
      (movie) => movie.id === parseInt(movieData.id)
    );

    //Check if movie was found
    if (movieId != -1) {
      if (Object.hasOwn(movies[movieId], 'ratings')) {
        movies[movieId].ratings.push({
          user: movieData.user,
          rating: movieData.rating,
        });
      } else {
        movies[movieId].ratings = [
          {
            user: movieData.user,
            rating: movieData.rating,
          },
        ];
      }

      //Calculating  user rating of movie
      movies[movieId].userRating = await getNewMovieRating(movies[movieId]);

      //Transfer it back to json and save it
      const json = JSON.stringify(movies);
      fs.writeFile('../data/FilmsData.json', json, 'utf-8');

      return true;
    } else {
      console.error(`Movie with id ${movieId} was not found!`);
      return false; //Movie was not found
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getNewMovieRating(movie) {
  const userRatingsSum = movie.ratings.reduce(
    (initValue, rating) => initValue + rating.rating,
    0
  );
  return userRatingsSum / movie.ratings.length;
}
