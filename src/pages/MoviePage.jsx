import { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import { FilmDataContext } from '../FilmDataProvider';
import { AuthContext } from '../components/AuthContext';
import { formatDate } from '../utils/DateUtils';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import NotFound from './NotFound';
import PersonCard from '../components/PersonCard';

import searchIcon from '../assets/search.svg';
import calendarIcon from '../assets/calendar.svg';
import cameraIcon from '../assets/camera.svg';
import cameraIconDark from '../assets/camera-dark.svg';
import personIcon from '../assets/person.svg';
import personIconDark from '../assets/person-dark.svg';
import starIcon from '../assets/star.svg';
import starIconDark from '../assets/star-dark.svg';
import heartOutlinedIcon from '../assets/heart-outlined.svg';
import heartFilledIcon from '../assets/heart-filled.svg';

const MoviePage = () => {
  const { isDarkMode } = useTheme();
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const { films, loading } = useContext(FilmDataContext);
  const [movie, setMovie] = useState(null);

  const [isFavorite, setFavorite] = useState(false);

  const { user, login } = useContext(AuthContext);
  const sliderRef = useRef();

  useEffect(() => {
    const movieIdInt = parseInt(movieId);
    const foundMovie = films.find((film) => film.id === movieIdInt);
    if (foundMovie) {
      setMovie(foundMovie);
      if (user && user.favoriteMovies)
        setFavorite(user.favoriteMovies.includes(movieIdInt));
    }
  }, [films, movieId, user]);

  const handleAddRating = async (formData) => {
    const rating = parseFloat(formData.get('rating'));
    if (!rating || rating < 0.1 || rating > 10) return;

    const ratingData = {
      id: movieId,
      userId: user.id,
      username: user.username,
      rating: rating,
    };

    await fetch('http://localhost:3000/movies/add-rating', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ratingData),
    })
      .then(() => window.location.reload())
      .catch(console.error);
  };

  const handleAddToFavorites = async () => {
    const reqData = {
      userId: user.id,
      movieId: movieId,
      isFavorite: isFavorite,
    };
    await fetch('http://localhost:3000/user/addFavorite', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData),
    })
      .then((res) => res.ok && res.json())
      .then((data) => login(data.user))
      .catch(console.error);
  };

  const scrollSlider = (direction) => {
    const scrollAmount = 250;
    sliderRef.current?.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  };

  if (loading)
    return (
      <Navbar>
        <h1>Loading...</h1>
      </Navbar>
    );
  if (!movie) return <NotFound />;

  return (
    <Navbar>
      <div className='movie-content -m-6 relative'>
        {/* Buy ticket button */}
        <Link
          to='/sessions'
          className='fixed bottom-10 right-25 flex justify-center items-center gap-x-3 bg-[#CB134A] h-17 w-56 rounded-full hover:cursor-pointer hover:bg-[#9D5F64] transition-all'
        >
          <svg
            viewBox='0 0 34 34'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='lg:h-8 lg:w-8 w-6 h-6 mt-1'
          >
            <path
              d='M22.5166 25.9836L21.051 24.5181C20.2843 23.7513 19.0412 23.7513 18.2744 24.5181C17.5077 25.2848 17.5077 26.5279 18.2744 27.2947L19.74 28.7602L16.5005 31.9997C15.0522 33.448 12.7041 33.448 11.2558 31.9997L9.71324 30.4572C9.55114 30.2951 9.50569 29.9611 9.70297 29.6769C10.1023 29.1017 10.5769 28.2571 10.7214 27.3063C10.8714 26.3201 10.6602 25.2339 9.71324 24.2869C8.76626 23.3399 7.68006 23.1287 6.69381 23.2787C5.74306 23.4233 4.89848 23.8979 4.32325 24.2972C4.03906 24.4945 3.70509 24.449 3.54299 24.2869L2.00043 22.7444C0.552147 21.2961 0.552147 18.9479 2.00043 17.4997L5.23992 14.2602L6.70522 15.7255C7.47196 16.4922 8.71509 16.4922 9.48183 15.7255C10.2486 14.9587 10.2486 13.7156 9.48183 12.9489L8.01653 11.4836L17.426 2.07404C18.8743 0.625755 21.2225 0.625756 22.6707 2.07404L24.2133 3.6166C24.3754 3.7787 24.4209 4.11267 24.2236 4.39686C23.8243 4.97209 23.3497 5.81667 23.2051 6.76742C23.0551 7.75367 23.2663 8.83986 24.2133 9.78685C25.1603 10.7338 26.2465 10.945 27.2327 10.7951C28.1835 10.6505 29.0281 10.1759 29.6033 9.77658C29.8875 9.5793 30.2214 9.62474 30.3836 9.78684L31.9261 11.3294C33.3744 12.7777 33.3744 15.1258 31.9261 16.5741L22.5166 25.9836ZM13.3382 16.8053C12.5715 16.0385 11.3284 16.0385 10.5616 16.8053C9.79488 17.572 9.79488 18.8151 10.5616 19.5819L14.418 23.4383C15.1848 24.205 16.4279 24.205 17.1946 23.4383C17.9614 22.6715 17.9614 21.4284 17.1946 20.6617L13.3382 16.8053Z'
              fill='#192231'
              stroke='#192231'
              strokeWidth='1.30891'
            ></path>
          </svg>
          <span className='text-white	text-xl font-bold'>Обрати сеанс</span>
        </Link>
        {/* Header */}
        <div
          className='movie-header relative min-h-[89.5vh] bg-cover bg-no-repeat bg-center bg-fixed'
          style={{ backgroundImage: `url(${movie.banner})` }}
        >
          <div className='w-full min-h-[89.5vh] bg-black/50'>
            <div className='pt-15 px-25 w-full flex justify-between'>
              <div className='flex items-center'>
                <button
                  onClick={() => navigate('/')}
                  className='flex justify-center items-center w-13 h-13 mr-3 bg-white/20 hover:bg-white/50 cursor-pointer rounded-full transition-colors'
                >
                  <img src={searchIcon} alt='Search' className='w-5 h-5' />
                </button>
                <p className='text-white uppercase text-sm font-bold'>
                  {movie.title}
                </p>
              </div>
              {user && (
                <div className='flex items-center'>
                  <button
                    onClick={handleAddToFavorites}
                    className='flex justify-center items-center w-13 h-13 mr-3 bg-white/20 hover:bg-white/50 cursor-pointer rounded-full transition-colors'
                  >
                    {!isFavorite ? (
                      <img
                        src={heartOutlinedIcon}
                        alt='Favorite Icon'
                        className='w-6 h-6'
                      />
                    ) : (
                      <img
                        src={heartFilledIcon}
                        alt='Favorite Icon'
                        className='w-6 h-6'
                      />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className='absolute bottom-10 w-full px-25 flex justify-between flex-col lg:flex-row'>
              <div className='max-w-2xl break-words'>
                <h1 className='text-white text-xl font-bold mb-2'>
                  {movie.title}
                </h1>
                <p className='text-sm font-extralight text-white/70'>
                  {movie.eng_title}
                </p>
                <p className='text-white text-lg font-normal'>
                  {movie.short_description}
                </p>
              </div>
              <div className='text-right'>
                <h3 className='text-white font-bold text-xl'>
                  Сеанси сьогодні
                </h3>
                <h5 className='text-white font-bold text-lg'>18:20</h5>{' '}
                {/* Change to real movie sessions */}
                <p className='font-light text-white/70 mt-1'>
                  {movie.generalRating || movie.rating} IMBD • {movie.year} •{' '}
                  {movie.movie_type} • {movie.duration} год • Від{' '}
                  {movie.age_rating} років
                </p>
                <div className='mt-3 flex gap-3 justify-end'>
                  <div className='flex justify-center items-center gap-3 bg-white/30 h-10 w-max py-2 px-4 rounded-lg'>
                    <img
                      src={calendarIcon}
                      alt='Calendar icon'
                      className='float-left'
                    />
                    <p className='text-white font-medium'>
                      У кіно до {movie.end_of_showtime}
                    </p>
                  </div>
                  <div className='flex justify-center items-center gap-3 bg-white/30 h-10 w-max py-2 px-4 rounded-lg'>
                    <p className='text-white font-medium'>{movie.movie_type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className='px-4 min-h-screen md:px-36 py-36 bg-[var(--bg-movie-page-main)]'>
          <div className='flex flex-col lg:flex-row flex-wrap gap-20'>
            {/* Poster */}
            <div className='flex justify-center lg:items-center flex-shrink relative'>
              <div className='relative'>
                <div className='absolute h-full w-full bg-[#1D232F] rotate-[4deg] -top-5 -right-4 z-0  shadow-lg'></div>
                <div className='absolute h-full w-full bg-[#1D232F] -rotate-[4deg] -top-5 right-4 z-0 shadow-lg'></div>
                <img
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  className='w-96 max-w-xs md:max-w-sm lg:max-w-md shadow-lg relative z-10'
                />
              </div>
            </div>

            {/* Movie Description and Genre */}
            <div className='flex flex-col flex-1 lg:min-w-[457px] gap-10 shrink-0'>
              <div
                className={`border-b pb-6 ${
                  isDarkMode ? 'border-white/20' : 'border-black/20'
                }`}
              >
                <h3 className='text-xl font-medium mb-4'>Яке це кіно</h3>
                <div className='flex flex-wrap gap-3'>
                  {movie.genre.map((g, i) => (
                    <span
                      key={i}
                      className='px-4 py-1 bg-[var(--bg-navbar-third)] text-lg rounded-lg'
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <p className='text-justify text-lg indent-10 leading-relaxed'>
                {movie.description}
              </p>
            </div>

            {/* Meta Info */}
            <div className='w-full lg:w-64 text-[var(--text-color)] text-base space-y-5'>
              {[
                ['Мова показу', movie.display_languages],
                ['Мова субтитрів', movie.subtitle_languages],
                ['Бюджет', [movie.budget]],
                ['Світова прем’єра', [formatDate(movie.release_date)]],
                ['Прем’єра', [formatDate(movie.premiere)]],
                ['Країна', [movie.countries]],
                ['Студія', [movie.studio]],
                ['Дистриб’ютор', [movie.distributor]],
              ].map(([title, lines], i) => (
                <div key={i}>
                  <h5 className='text-[var(--text-color)] font-bold'>
                    {title}
                  </h5>
                  {lines.map((line, j) => (
                    <p key={j} className='font-light'>
                      {line + ' '}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trailer */}
        <div className='bg-[var(--bg-movie-page-second)] px-36 py-10 min-h-[433px]'>
          <div className='flex items-center gap-5'>
            <h2 className='font-bold lg:text-4xl mb-5'>Промо фільму</h2>
            <img
              src={isDarkMode ? cameraIcon : cameraIconDark}
              alt='Camera icon'
              className='pb-2'
            />
          </div>
          <div className='w-96'>
            <iframe
              src={movie.trailer}
              title='Трейлер'
              className='w-96 h-50 object-cover mb-2'
              allowFullScreen
            />
            <p className='font-bold text-lg'>Трейлер</p>
          </div>
        </div>

        {/* Cast & Crew */}
        <div className='px-36 py-10 bg-[var(--bg-movie-page-main)]'>
          <div className='flex items-center justify-between mb-5'>
            <div className='flex items-center gap-5'>
              <h2 className='font-bold lg:text-4xl'>
                Знімальна група та акторський склад
              </h2>
              <img
                src={isDarkMode ? personIcon : personIconDark}
                alt='Profile icon'
                className='w-8'
              />
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => scrollSlider(-1)}
                className={`px-4 py-2 rounded hover:cursor-pointer transition ${
                  isDarkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-300 text-black hover:bg-gray-400'
                }`}
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
              <button
                onClick={() => scrollSlider(1)}
                className={`px-4 py-2 rounded hover:cursor-pointer transition ${
                  isDarkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-300 text-black hover:bg-gray-400'
                }`}
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            ref={sliderRef}
            className='flex overflow-hidden scrollbar-hide gap-3 scroll-smooth'
          >
            <PersonCard
              name={movie.director.name}
              photo={movie.director.photo}
              role='Продюсер'
            />
            {movie.cast.map((actor, i) => (
              <PersonCard
                key={i}
                name={actor.name}
                photo={actor.photo}
                role={actor.role}
              />
            ))}
          </div>
        </div>

        {/* User's movie ratings */}
        <div className='px-36 py-10  bg-[var(--bg-movie-page-second)] rounded-xl shadow-lg'>
          <div className='flex items-center gap-2'>
            <h2 className='font-bold lg:text-4xl'>Рейтинги користувачів</h2>
            <img
              src={isDarkMode ? starIcon : starIconDark}
              alt='Star icon'
              className='w-10 pt-2'
            />
          </div>
          {/* Sending form */}
          {user ? (
            <div className='flex justify-center my-5'>
              <form
                action={handleAddRating}
                className='flex flex-col gap-y-5 min-h-50 w-86 bg-[var(--bg-movie-page-main)] rounded-lg shadow-lg p-5 hover:scale-105 transition-all'
              >
                <label
                  htmlFor='rating'
                  className='text-center text-2xl font-bold'
                >
                  Ваш рейтинг
                </label>
                <input
                  type='number'
                  min={0.1}
                  max={10}
                  step={0.1}
                  id='rating'
                  name='rating'
                  className='bg-[var(--input-bg)] text-[var(--text-color)] placeholder-gray-500 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                />
                <button
                  type='submit'
                  className='text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                >
                  Надіслати
                </button>
              </form>
            </div>
          ) : (
            <div className='flex justify-center my-5 relative'>
              <div
                className={`absolute text-center lg:min-w-196 min-h-full z-10 ${
                  isDarkMode ? 'bg-black/30' : 'bg-white/30'
                } rounded-lg p-5 flex justify-center items-center text-3xl font-bold`}
              >
                Авторизуйтеся, щоб мати змогу оцінити фільм.
              </div>
              <form className=' filter blur-md flex flex-col gap-y-5 min-h-50 w-86 bg-[var(--bg-movie-page-main)] rounded-lg shadow-lg p-5 hover:scale-105 transition-all m-15'>
                <label
                  htmlFor='rating'
                  className='text-center text-2xl font-bold'
                >
                  Ваш рейтинг
                </label>
                <input
                  type='number'
                  min={0.1}
                  max={10}
                  step={0.1}
                  id='rating'
                  name='rating'
                  disabled
                  className='bg-[var(--input-bg)] text-[var(--text-color)] placeholder-gray-500 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                />
                <button
                  type='submit'
                  disabled
                  className='text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                >
                  Надіслати
                </button>
              </form>
            </div>
          )}
          <div>
            {movie.ratings ? (
              <div>
                <h3 className='font-bold text-2xl mb-4'>
                  Рейтинги користувачів:{' '}
                </h3>
                <div className='flex flex-wrap gap-3 px-16'>
                  {movie.ratings.map((rating, i) => (
                    <div
                      key={i}
                      className='flex flex-col gap-y-3 min-h-36 min-w-36 bg-[var(--bg-movie-page-main)] rounded-lg shadow-lg p-5 hover:scale-105 transition-all'
                    >
                      <h4 className='text-xl text-center font-bold mb-2'>
                        {rating.user}
                      </h4>
                      <div className='flex justify-center gap-x-1'>
                        <span className='text-lg text-yellow-500 font-medium'>
                          {rating.rating}/10
                        </span>
                        <img
                          src={isDarkMode ? starIcon : starIconDark}
                          alt='Star icon'
                          className='w-6'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <h3 className='lg:text-2xl mb-4'>
                Станьте першим, хто оцінить цей фільм.
              </h3>
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default MoviePage;
