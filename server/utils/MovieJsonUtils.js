import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../../data/FilmsData.json');

export async function saveMovies(movies){
  try{
    const json = JSON.stringify(movies, null, 2);
    await fs.writeFile(filePath, json, "utf-8");
  }catch(error){
    console.error(error);
    throw new Error("Error saving movies data");
  }
}

export async function getMovies() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const movies = JSON.parse(data);
    return movies;
  } catch (error) {
    console.error(error);
    throw new Error("Error reading movies data");
  }
}

export async function addRatingToMovie(movieData) {
  try {
    const movies = await getMovies();

    //Finding movie by id
    const movieId = movies.findIndex((movie) => movie.id === parseInt(movieData.id));

    if(movieId === -1) throw new Error(`Movie with id ${movieData.id} was not found`);

    if (!Object.hasOwn(movies[movieId], 'ratings')) movies[movieId].ratings = [];

    const existingUserRatingIndex = movies[movieId].ratings.findIndex((r)=> r.userId === movieData.userId)

    if(existingUserRatingIndex === -1){
        movies[movieId].ratings.push({
        userId: movieData.userId,
        user: movieData.username,
        rating: movieData.rating,
      });
    }else{
      movies[movieId].ratings[existingUserRatingIndex].rating = movieData.rating;
    }

    //Calculating movie rating
    movies[movieId].generalRating = await getNewMovieRating(movies[movieId]);

    //Transfer it back to json and save it
    await saveMovies(movies);
  } catch (error) {
    console.error(error);
    throw new Error("Error adding rating to movie");
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