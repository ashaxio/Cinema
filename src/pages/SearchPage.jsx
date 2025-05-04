import Navbar from "../components/navbar";
import { useState, useEffect, useContext, useRef } from "react";
import { FilmDataContext } from "../FilmDataProvider";
import MovieCard from "/src/components/MovieCard.jsx";

const SearchPage = () => {
  const { films } = useContext(FilmDataContext);

  const allGenres = [
    "Розважальне",
    "Фентезі",
    "Пригодницьке",
    "Cімейне",
    "Екшн",
    "Фантастика",
    "Пригоди",
    "Бойовик",
    "Трилер",
    "Кримінал",
    "Жахи",
    "Драматичне",
    "Сімейне",
    "Мюзикл",
    "Біографічне",
    "Стильне",
    "Скандальне",
    "Драма",
    "Напружене",
    "Голівудське",
    "Комедія",
  ];

  const allCountries = [
    "Нова Зеландія",
    "США",
    "Великобританія",
    "Італія",
    "Еквадор",
    "Франція",
    "Туреччина",
    "Канада",
    "Угорщина",
  ];

  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const [yearRange, setYearRange] = useState({ min: 1950, max: 2025 });
  const [selectedCountries, setSelectedCountries] = useState([]);

  // UI states
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [countryFilter, setCountryFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    genres: false,
    rating: false,
    releaseYear: false,
    countries: false,
  });
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isCountriesDropdownOpen, setIsCountriesDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(8);

  const yearDropdownRef = useRef(null);
  const countriesDropdownRef = useRef(null);

  useEffect(() => {
    setActiveFilters({
      genres: selectedGenres.length > 0,
      rating: ratingValue > 0,
      releaseYear: yearRange.min !== 1950 || yearRange.max !== 2025,
      countries: selectedCountries.length > 0,
    });
  }, [selectedGenres, ratingValue, yearRange, selectedCountries]);

  useEffect(() => {
    if (!films) return;

    const filtered = films.filter((movie) => {
      const isGenreMatch =
        selectedGenres.length === 0 ||
        selectedGenres.some(
          (genre) => movie.genre && movie.genre.includes(genre)
        );

      const isRatingMatch =
        ratingValue === 0 ? true : movie.rating <= ratingValue;

      const movieYear = movie.year || 0;
      const isYearMatch =
        movieYear >= yearRange.min && movieYear <= yearRange.max;

      const isCountryMatch =
        selectedCountries.length === 0 ||
        (movie.countries &&
          movie.countries.some((c) => selectedCountries.includes(c)));

      return isGenreMatch && isRatingMatch && isYearMatch && isCountryMatch;
    });

    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [films, selectedGenres, ratingValue, yearRange, selectedCountries]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setIsYearDropdownOpen(false);
      }
      if (
        countriesDropdownRef.current &&
        !countriesDropdownRef.current.contains(event.target)
      ) {
        setIsCountriesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const toggleCountry = (country) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const removeFilter = (type) => {
    if (type === "genres") {
      setSelectedGenres([]);
    } else if (type === "rating") {
      setRatingValue(0);
    } else if (type === "releaseYear") {
      setYearRange({ min: 1950, max: 2025 });
    } else if (type === "countries") {
      setSelectedCountries([]);
    }
  };

  const filteredCountries = allCountries.filter((country) =>
    country.toLowerCase().includes(countryFilter.toLowerCase())
  );

  const indexOfLastMovie = currentPage * moviesPerPage;
  const currentMovies = filteredMovies.slice(0, indexOfLastMovie);

  // Load more movies
  const loadMoreMovies = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const hasMoreMovies = indexOfLastMovie < filteredMovies.length;

  return (
    <>
      <Navbar>
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-96 bg-gray-800 p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold">MOVIES</div>
              <div className="cursor-pointer">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  ></path>
                </svg>
              </div>
            </div>

            {/* Genre filter */}
            <div className="mb-6">
              <div className="text-lg font-semibold mb-2">GENRES</div>
              <div className="space-y-2 max-h-300 overflow-y-auto">
                {allGenres.map((genre) => (
                  <div
                    key={genre}
                    className={`flex items-center justify-between p-2 cursor-pointer rounded ${
                      selectedGenres.includes(genre)
                        ? "bg-gray-700"
                        : "hover:bg-gray-700/50"
                    }`}
                    onClick={() => toggleGenre(genre)}
                  >
                    <div>{genre}</div>
                    {selectedGenres.includes(genre) && (
                      <div className="text-white">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rating filter */}
            <div className="mb-6">
              <div className="text-lg font-semibold mb-2">RATING</div>
              <div className="mb-2">IMDB</div>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={ratingValue}
                  onChange={(e) => setRatingValue(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="ml-2">
                  {ratingValue > 0 ? ratingValue : "Any"}
                </div>
              </div>
            </div>

            {/* Release year filter */}
            <div className="mb-6" ref={yearDropdownRef}>
              <div className="text-lg font-semibold mb-2">RELEASE YEAR</div>
              <div className="relative mb-4">
                <div
                  className="bg-gray-700 p-2 rounded flex items-center justify-between cursor-pointer"
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                >
                  <div>{`${yearRange.min} - ${yearRange.max}`}</div>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg
                      className={`w-4 h-4 transform ${
                        isYearDropdownOpen ? "rotate-180" : ""
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

                {isYearDropdownOpen && (
                  <div className="absolute z-10 w-full bg-gray-700 mt-1 rounded p-4">
                    <div className="flex justify-between mb-4">
                      <input
                        type="number"
                        min="1950"
                        max="2025"
                        value={yearRange.min}
                        onChange={(e) =>
                          setYearRange((prev) => ({
                            ...prev,
                            min: Math.min(Number(e.target.value), prev.max),
                          }))
                        }
                        className="bg-gray-600 w-20 p-1 text-center rounded"
                      />
                      <input
                        type="number"
                        min="1950"
                        max="2025"
                        value={yearRange.max}
                        onChange={(e) =>
                          setYearRange((prev) => ({
                            ...prev,
                            max: Math.max(Number(e.target.value), prev.min),
                          }))
                        }
                        className="bg-gray-600 w-20 p-1 text-center rounded"
                      />
                    </div>

                    <div className="relative mt-4">
                      <div className="relative mb-4">
                        <span className="text-xs block mb-1">Min</span>
                        <input
                          type="range"
                          min="1950"
                          max="2025"
                          value={yearRange.min}
                          onChange={(e) =>
                            setYearRange((prev) => ({
                              ...prev,
                              min: Math.min(Number(e.target.value), prev.max),
                            }))
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="relative">
                        <span className="text-xs block mb-1">Max</span>
                        <input
                          type="range"
                          min="1950"
                          max="2025"
                          value={yearRange.max}
                          onChange={(e) =>
                            setYearRange((prev) => ({
                              ...prev,
                              max: Math.max(Number(e.target.value), prev.min),
                            }))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Countries filter */}
            <div className="mb-6" ref={countriesDropdownRef}>
              <div className="text-lg font-semibold mb-2">COUNTRIES</div>
              <div className="relative mb-4">
                <div
                  className="bg-gray-700 p-2 rounded flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setIsCountriesDropdownOpen(!isCountriesDropdownOpen)
                  }
                >
                  <input
                    type="text"
                    placeholder="Filter countries..."
                    value={countryFilter}
                    onChange={(e) => {
                      e.stopPropagation();
                      setCountryFilter(e.target.value);
                      setIsCountriesDropdownOpen(true);
                    }}
                    className="bg-transparent w-full placeholder-gray-400 outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg
                      className={`w-4 h-4 transform ${
                        isCountriesDropdownOpen ? "rotate-180" : ""
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

                {isCountriesDropdownOpen && (
                  <div className="absolute z-10 w-full bg-gray-700 mt-1 rounded max-h-60 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <div
                        key={country}
                        className={`p-2 cursor-pointer hover:bg-gray-600 ${
                          selectedCountries.includes(country)
                            ? "bg-gray-600"
                            : ""
                        }`}
                        onClick={() => toggleCountry(country)}
                      >
                        {country}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected countries */}
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((country) => (
                  <div
                    key={country}
                    className="bg-gray-700 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {country}
                    <span
                      className="ml-1 cursor-pointer"
                      onClick={() => toggleCountry(country)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 p-6">
            <div className="flex flex-wrap items-center mb-6 gap-2">
              <div className="text-2xl font-bold mr-4">MOVIES</div>

              {activeFilters.genres && (
                <div className="bg-gray-700 rounded-full px-3 py-1 flex items-center space-x-2">
                  <span>Genres:</span>
                  <span className="font-semibold">
                    {selectedGenres.join(", ")}
                  </span>
                  <button onClick={() => removeFilter("genres")}>×</button>
                </div>
              )}

              {activeFilters.rating && (
                <div className="bg-gray-700 rounded-full px-3 py-1 flex items-center space-x-2">
                  <span>Rating ≤</span>
                  <span className="font-semibold">{ratingValue}</span>
                  <button onClick={() => removeFilter("rating")}>×</button>
                </div>
              )}

              {activeFilters.releaseYear && (
                <div className="bg-gray-700 rounded-full px-3 py-1 flex items-center space-x-2">
                  <span>Year:</span>
                  <span className="font-semibold">
                    {yearRange.min}–{yearRange.max}
                  </span>
                  <button onClick={() => removeFilter("releaseYear")}>×</button>
                </div>
              )}

              {activeFilters.countries && (
                <div className="bg-gray-700 rounded-full px-3 py-1 flex items-center space-x-2">
                  <span>Countries:</span>
                  <span className="font-semibold">
                    {selectedCountries.join(", ")}
                  </span>
                  <button onClick={() => removeFilter("countries")}>×</button>
                </div>
              )}
            </div>

            {/* Movies grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
              {currentMovies.map((movie) => (
                <div key={movie.id} className="flex justify-center">
                  <MovieCard id={movie.id} />
                </div>
              ))}
            </div>

            {filteredMovies.length === 0 && (
              <div className="text-center mt-10">
                <div className="text-xl">
                  No movies found matching your filters
                </div>
              </div>
            )}

            {hasMoreMovies && (
              <div className="mt-6 flex justify-center">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                  onClick={loadMoreMovies}
                >
                  LOAD MORE
                </button>
              </div>
            )}
          </div>
        </div>
      </Navbar>
    </>
  );
};

export default SearchPage;
