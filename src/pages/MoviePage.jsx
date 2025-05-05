import '../MoviePageTemp.css';
import { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FilmDataContext } from '../FilmDataProvider';
import { AuthContext } from '../components/AuthContext';
import Navbar from '../components/navbar';

import searchIcon from '../assets/search.svg';
import calendarIcon from '../assets/calendar.svg';
import cameraIcon from '../assets/camera.svg';
import personIcon from '../assets/person.svg';
import starIcon from '../assets/star.svg';

function formatDate(dateString) {
  const months = [
    'січня',
    'лютого',
    'березня',
    'квітня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня',
  ];

  const [year, month, day] = dateString.split('-');
  const monthName = months[parseInt(month, 10) - 1];
  return `${parseInt(day, 10)} ${monthName} ${year}р.`;
}

const MoviePage = () => {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const { films, loading } = useContext(FilmDataContext);
  const [movie, setMovie] = useState(null);

  const { user } = useContext(AuthContext);

  const sliderRef = useRef();

  useEffect(() => {
    const foundMovie = films.find(
      (film) => String(film.id) === String(movieId)
    );
    if (foundMovie) setMovie(foundMovie);
    console.log(user);
  }, [films, movieId]);

  const handleAddRating = (formData) => {
    const rating = parseFloat(formData.get('rating'));
    if (!rating || rating < 0.1 || rating > 10) return;

    const ratingData = {
      id: movieId,
      user: user.username || "Not specified",
      rating,
    };

    fetch('http://localhost:3000/movies/add-rating', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ratingData),
    })
      .then(() => window.location.reload())
      .catch(console.error);
  };

  const scrollSlider = (direction) => {
    const scrollAmount = 250;
    sliderRef.current?.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  };

  if (loading) return <h1>Loading...</h1>;
  if (!movie) return <h1>ERROR 404: PAGE NOT FOUND!</h1>;

  return (
    <Navbar>
      <div className='movie-content -m-6'>
        {/* Header */}
        <div
          className='movie-header relative min-h-[89.5vh] bg-cover bg-no-repeat bg-center bg-fixed'
          style={{ backgroundImage: `url(${movie.banner})` }}
        >
          <div className='w-full min-h-[89.5vh] bg-black/50'>
            <div className='absolute top-15 left-25 flex items-center'>
              <button
                onClick={() => navigate(-1)}
                className='flex justify-center items-center w-13 h-13 mr-3 bg-white/20 hover:bg-white/50 cursor-pointer rounded-full transition-colors'
              >
                <img src={searchIcon} alt='Search' className='w-5 h-5' />
              </button>
              <p className='uppercase text-sm font-bold'>{movie.title}</p>
            </div>

            <div className='absolute -bottom-15 w-full p-25 flex justify-between'>
              <div className='max-w-2xl break-words'>
                <h1 className='text-xl font-bold mb-2'>{movie.title}</h1>
                <p className='text-sm font-extralight text-white/70'>
                  {movie.eng_title}
                </p>
                <p className='text-lg font-normal'>{movie.short_description}</p>
              </div>
              <div className='text-right'>
                <h3 className='font-bold text-xl'>Сеанси сьогодні</h3>
                <h5 className='font-bold text-lg'>18:20</h5>{' '}
                {/* Change to real movie sessions */}
                <p className='font-light text-white/70 mt-1'>
                  {movie.generalRating || movie.rating} IMBD • {movie.year} •{' '}
                  {movie.generalGenre} • {movie.duration} год • Від{' '}
                  {movie.ageLimin} років
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
        <div className='px-4 min-h-screen md:px-36 py-36 bg-[#1E293B]'>
          <div className='flex flex-col lg:flex-row gap-20'>
            {/* Poster */}
            <div className='flex justify-center lg:items-center flex-shrink-0 relative'>
              <div className='relative'>
                {/* Фоновий блок */}
                <div className='absolute h-full w-full bg-[#1D232F] rotate-[4deg] -top-5 -right-4 z-0  shadow-lg'></div>
                <div className='absolute h-full w-full bg-[#1D232F] -rotate-[4deg] -top-5 right-4 z-0 shadow-lg'></div>
                {/* Зображення постера */}
                <img
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  className='w-96 max-w-xs md:max-w-sm lg:max-w-md shadow-lg relative z-10'
                />
              </div>
            </div>

            {/* Movie Description and Genre */}
            <div className='flex flex-col flex-1 gap-10'>
              <div className='border-b border-white/20 pb-6'>
                <h3 className='text-xl font-medium mb-4'>Яке це кіно</h3>
                <div className='flex flex-wrap gap-3'>
                  {movie.genre.map((g, i) => (
                    <span
                      key={i}
                      className='px-4 py-1 bg-[#3B485E] text-lg rounded-lg'
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
            <div className='w-full lg:w-64 text-white text-base space-y-5'>
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
                  <h5 className='text-white/50 font-bold'>{title}</h5>
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
        <div className='px-36 py-10 h-[433px]'>
          <div className='flex items-center gap-5'>
            <h2 className='font-bold text-[40px] mb-5'>Промо фільму</h2>
            <img src={cameraIcon} alt='Camera icon' className='pb-2' />
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
        <div className='px-36 py-10 bg-[#1E293B]'>
          <div className='flex items-center justify-between mb-5'>
            <div className='flex items-center gap-5'>
              <h2 className='font-bold text-[40px]'>
                Знімальна група та акторський склад
              </h2>
              <img src={personIcon} alt='Profile icon' className='w-8' />
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => scrollSlider(-1)}
                className='px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 hover:cursor-pointer transition'
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
                className='px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 hover:cursor-pointer transition'
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
        <div className='px-36 py-10'>
          <div className='flex items-center gap-2'>
            <h2 className='font-bold text-[40px]'>Рейтинги користувачів</h2>
            <img src={starIcon} alt='Star icon' className='w-10 pt-2' />
          </div>
          {/* Sending form */}
          {user ? (
            <div className='flex justify-center my-5'>
              <form
                action={handleAddRating}
                className='flex flex-col gap-y-5 min-h-50 w-86 bg-[#1E293B] rounded-lg shadow-lg p-5 hover:scale-105 transition-all'
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
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"'
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
              <div className='absolute min-w-196 min-h-full z-10 bg-black/30 rounded-lg p-5 flex justify-center items-center text-3xl font-bold'>Авторизуйтеся, щоб мати змогу оцінити фільм.</div>
              <form                
                className=' filter blur-md flex flex-col gap-y-5 min-h-50 w-86 bg-[#1E293B] rounded-lg shadow-lg p-5 hover:scale-105 transition-all m-15'
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
                  disabled
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"'
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
                    <div className='flex flex-col gap-y-3 min-h-36 min-w-36 bg-[#1E293B] rounded-lg shadow-lg p-5 hover:scale-105 transition-all'>
                      <h4 className='text-xl text-center font-bold mb-2'>
                        {rating.user}
                      </h4>
                      <div className='flex justify-center gap-x-1'>
                        <span className='text-lg text-yellow-500 font-medium'>
                          {rating.rating}/10
                        </span>
                        <img src={starIcon} alt='Star icon' className='w-6' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <h3 className='text-2xl mb-4 italic'>
                Рейтинги користувачів відсутні
              </h3>
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
};

const PersonCard = ({ name, photo, role }) => (
  <div className='flex-shrink-0 w-60 bg-gray-800 rounded-lg p-4 text-center'>
    <img
      src={photo}
      alt={name}
      className='w-full h-60 object-cover rounded mb-3'
    />
    <h3 className='text-lg font-semibold'>{name}</h3>
    <p className='text-sm text-white/70'>{role}</p>
  </div>
);

export default MoviePage;
