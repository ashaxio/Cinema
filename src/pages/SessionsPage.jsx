import { useContext, useEffect, useRef, useState } from "react";
import { FilmDataContext } from "../FilmDataProvider";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import sessionsData from "../../data/SessionsData.json";
import Navbar from "../components/navbar";

const SessionPage = () => {
  const { films } = useContext(FilmDataContext);
  const [sessions, setSessions] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [movieFilter, setMovieFilter] = useState("");
  const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [isDatesDropdownOpen, setIsDatesDropdownOpen] = useState(false);

  const moviesDropdownRef = useRef(null);
  const datesDropdownRef = useRef(null);

  useEffect(() => {
    setSessions(sessionsData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moviesDropdownRef.current &&
        !moviesDropdownRef.current.contains(event.target)
      ) {
        setIsMoviesDropdownOpen(false);
      }
      if (
        datesDropdownRef.current &&
        !datesDropdownRef.current.contains(event.target)
      ) {
        setIsDatesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMovie = (movieTitle) => {
    setSelectedMovies((prev) =>
      prev.includes(movieTitle)
        ? prev.filter((m) => m !== movieTitle)
        : [...prev, movieTitle]
    );
  };

  const toggleDate = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const today = new Date();
  const upcomingDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const filteredSessions = sessions.filter((s) => {
    const movie = films.find((f) => f.id === s.movie_id);
    const matchMovie =
      selectedMovies.length === 0 ||
      (movie && selectedMovies.includes(movie.title));
    const matchDate =
      selectedDates.length === 0 || selectedDates.includes(s.date);
    return matchMovie && matchDate && s.available_seats.length > 0;
  });

  const sessionsByMovie = films
    .map((movie) => {
      const movieSessions = filteredSessions
        .filter((s) => s.movie_id === movie.id)
        .sort(
          (a, b) =>
            new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
        );
      return movieSessions.length > 0
        ? { movie, sessions: movieSessions }
        : null;
    })
    .filter(Boolean);

  const formatDate = (date) => {
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <Navbar>
      <div className="p-8 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Розклад сеансів</h1>

        <div className="flex flex-wrap gap-8 mb-8">
          {/* Movies Filter */}
          <div ref={moviesDropdownRef} className="w-96">
            <div className="text-lg font-semibold mb-2">Фільми</div>
            <div className="relative">
              <div
                className="bg-gray-700 p-2 rounded flex items-center justify-between cursor-pointer"
                onClick={() => setIsMoviesDropdownOpen(!isMoviesDropdownOpen)}
              >
                <input
                  type="text"
                  placeholder="Оберіть фільм..."
                  value={movieFilter}
                  onChange={(e) => {
                    e.stopPropagation();
                    setMovieFilter(e.target.value);
                    setIsMoviesDropdownOpen(true);
                  }}
                  className="bg-transparent w-full placeholder-gray-400 outline-none text-base text-gray-200"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg
                    className={`w-4 h-4 transform ${
                      isMoviesDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              {isMoviesDropdownOpen && (
                <div className="absolute z-10 w-full bg-gray-700 mt-1 rounded max-h-60 overflow-y-auto">
                  {films
                    .filter((f) =>
                      f.title.toLowerCase().includes(movieFilter.toLowerCase())
                    )
                    .map((movie) => (
                      <div
                        key={movie.id}
                        className={`p-2 cursor-pointer hover:bg-gray-600 text-base text-gray-200 ${
                          selectedMovies.includes(movie.title)
                            ? "bg-gray-600"
                            : ""
                        }`}
                        onClick={() => toggleMovie(movie.title)}
                      >
                        {movie.title}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedMovies.map((movie) => (
                <div
                  key={movie}
                  className="bg-gray-700 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {movie}
                  <span
                    className="ml-1 cursor-pointer"
                    onClick={() => toggleMovie(movie)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dates Filter */}
          <div ref={datesDropdownRef} className="w-96">
            <div className="text-lg font-semibold mb-2">Дати</div>
            <div className="relative">
              <div
                className="bg-gray-700 p-2 rounded flex items-center justify-between cursor-pointer"
                onClick={() => setIsDatesDropdownOpen(!isDatesDropdownOpen)}
              >
                <span className="text-base text-gray-200">
                  {selectedDates.length > 0
                    ? selectedDates
                        .map((d) => formatDate(new Date(d)))
                        .join(", ")
                    : "Оберіть дату..."}
                </span>
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg
                    className={`w-4 h-4 transform ${
                      isDatesDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              {isDatesDropdownOpen && (
                <div className="absolute z-10 w-full bg-gray-700 mt-1 rounded max-h-60 overflow-y-auto">
                  {upcomingDates.map((date) => {
                    const iso = date.toISOString().split("T")[0];
                    return (
                      <div
                        key={iso}
                        className={`p-2 cursor-pointer hover:bg-gray-600 text-base text-gray-200 ${
                          selectedDates.includes(iso) ? "bg-gray-600" : ""
                        }`}
                        onClick={() => toggleDate(iso)}
                      >
                        {formatDate(date)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedDates.map((date) => (
                <div
                  key={date}
                  className="bg-gray-700 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {formatDate(new Date(date))}
                  <span
                    className="ml-1 cursor-pointer"
                    onClick={() => toggleDate(date)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="space-y-10">
          {sessionsByMovie.map(({ movie, sessions }) => (
            <div
              key={movie.id}
              className="flex flex-col md:flex-row gap-6 border-b border-gray-600 pb-6"
            >
              <MovieCard id={movie.id} />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Сеанси:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sessions.map((s) => {
                    const dateFormatted = new Date(s.date).toLocaleDateString(
                      "uk-UA",
                      {
                        day: "numeric",
                        month: "long",
                      }
                    );
                    return (
                      <Link
                        to={`/booking/${s.id}`}
                        key={s.id}
                        className="bg-[#2f2f2f] p-4 rounded-lg shadow border border-transparent hover:border-[#5031D6] text-lg block"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span>{dateFormatted}</span>
                          <span className="text-white font-semibold">
                            {s.time}
                          </span>
                        </div>
                        <p className="text-white font-semibold">{s.price}₴</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Navbar>
  );
};

export default SessionPage;
