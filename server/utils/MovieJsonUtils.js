import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../../data/FilmsData.json');

export async function getMovies() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
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

      //Calculating movie rating
      movies[movieId].generalRating = await getNewMovieRating(movies[movieId]);

      //Transfer it back to json and save it
      const json = JSON.stringify(movies);
      fs.writeFile(filePath, json, 'utf-8');

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
  let userRatingsSum = movie.ratings.reduce(
    (initValue, rating) => initValue + rating.rating,
    0
  );
  userRatingsSum += movie.rating;
  return formatMovieRating(userRatingsSum / (movie.ratings.length + 1));
}

function formatMovieRating(movieRating) {
  return Math.round(movieRating * 10) / 10;
}