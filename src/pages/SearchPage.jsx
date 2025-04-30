import Navbar from "../components/navbar";
import { useState, useEffect, useContext } from "react";
import { FilmDataContext } from "../FilmDataProvider";
import MovieCard from '/src/components/MovieCard.jsx'

const SearchPage = () => { 
  const { films } = useContext(FilmDataContext);

  const allGenres = [
    'Розважальне', 'Фентезі', 'Пригодницьке', 'Cімейне', 'Екшн',
    'Фантастика', 'Пригоди', 'Бойовик', 'Трилер', 'Кримінал',
    'Жахи', 'Драматичне', 'Сімейне', 'Мюзикл', 'Біографічне',
    'Стильне', 'Скандальне', 'Драма', 'Напружене', 'Голівудське',
    'Комедія'
  ];
  
  const allCountries = [
    'Нова Зеландія', 'США', 'Великобританія', 'Італія', 
    'Еквадор', 'Франція', 'Туреччина', 'Канада', 'Угорщина'
  ];

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const [yearRange, setYearRange] = useState({ min: 1950, max: 2025 });
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [countryFilter, setCountryFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({ genres: true, rating: true, releasYear: true });
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isCountriesDropdownOpen, setIsCountriesDropdownOpen] = useState(false);

  useEffect(() => {
    if (!films) return;
    
    const filtered = films.filter(movie => {
      const movieYear = movie.year;
      
      const isGenreMatch = selectedGenres.length === 0 || 
        selectedGenres.some(genre => movie.genre.includes(genre));

      const isRatingMatch = ratingValue === 0 ? true : movie.rating <= ratingValue;
      
      const isYearMatch = movieYear >= yearRange.min && movieYear <= yearRange.max;
      
      const isCountryMatch = selectedCountries.length === 0 || (movie.countries && movie.countries.some(c => selectedCountries.includes(c)));

      return isGenreMatch && isRatingMatch && isYearMatch && isCountryMatch;
    });
    
    setFilteredMovies(filtered);
  }, [films, selectedGenres, ratingValue, yearRange, selectedCountries]);
  
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const toggleCountry = (country) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const removeFilter = (type) => {
    setActiveFilters({...activeFilters, [type]: false});
    if (type === 'genres') {
      setSelectedGenres([]);
    } else if (type === 'rating') {
      setRatingValue(0);
    } else if (type === 'releasYear') {
      setYearRange({ min: 1950, max: 2025 });
    }
  };
  
  const filteredCountries = allCountries.filter(country =>
    country.toLowerCase().includes(countryFilter.toLowerCase())
  );

  return (
    <>
      <Navbar userId="123">
        <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-96 bg-gray-800 p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="text-2xl font-bold">MOVIES</div>
            <div className="cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </div>
          </div>

          {/* Genre filter */}
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">GENRES</div>
            <div className="space-y-2">
              {allGenres.map(genre => (
                <div 
                  key={genre} 
                  className={`flex items-center justify-between p-2 cursor-pointer ${ 
                    selectedGenres.includes(genre) ? 'bg-gray-700' : ''
                  }`}
                  onClick={() => toggleGenre(genre)}
                >
                  <div>{genre}</div>
                  {selectedGenres.includes(genre) && (
                    <div className="text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
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
            <div className="mb-2">IMBD</div>
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
              <div className="ml-2">{ratingValue}</div>
            </div>
          </div>

          {/* Release year filter */}
          <div className="mb-6">
              <div className="text-lg font-semibold mb-2">RELEASE YEAR</div>
              <div className="relative mb-4">
                <div 
                  className="bg-gray-700 p-2 rounded flex items-center justify-between cursor-pointer"
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                >
                  <div>{`${yearRange.min} - ${yearRange.max}`}</div>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
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
                        onChange={(e) => setYearRange(prev => ({
                          ...prev,
                          min: Math.min(Number(e.target.value), prev.max)
                        }))}
                        className="bg-gray-600 w-20 p-1 text-center"
                      />
                      <input
                        type="number"
                        min="1950"
                        max="2025"
                        value={yearRange.max}
                        onChange={(e) => setYearRange(prev => ({
                          ...prev,
                          max: Math.max(Number(e.target.value), prev.min)
                        }))}
                        className="bg-gray-600 w-20 p-1 text-center"
                      />
                    </div>
                    <div className="relative h-8">
                      <input
                        type="range"
                        min="1950"
                        max="2025"
                        value={yearRange.min}
                        onChange={(e) => setYearRange(prev => ({
                          ...prev,
                          min: Math.min(Number(e.target.value), prev.max)
                        }))}
                        className="absolute w-full"
                      />
                      <input
                        type="range"
                        min="1950"
                        max="2025"
                        value={yearRange.max}
                        onChange={(e) => setYearRange(prev => ({
                          ...prev,
                          max: Math.max(Number(e.target.value), prev.min)
                        }))}
                        className="absolute w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* Countries filter */}
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">COUNTRIES</div>
              <div className="relative mb-4">
                <div 
                  className="bg-gray-700 p-2 rounded flex items-center justify-between cursor-pointer"
                  onClick={() => setIsCountriesDropdownOpen(!isCountriesDropdownOpen)}
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
                    className="bg-transparent w-full placeholder-gray-400"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                
                {isCountriesDropdownOpen && (
                  <div className="absolute z-10 w-full bg-gray-700 mt-1 rounded max-h-60 overflow-y-auto">
                    {filteredCountries.map(country => (
                      <div 
                        key={country} 
                        className={`p-2 cursor-pointer hover:bg-gray-600 ${
                          selectedCountries.includes(country) ? 'bg-gray-600' : ''
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
                {selectedCountries.map(country => (
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
          <div className="flex items-center mb-6">
            <div className="text-2xl font-bold mr-4">FILTERED MOVIES</div>
            {activeFilters.genres && (
              <div className="bg-gray-700 rounded-full px-3 py-1 flex items-center mr-2">
                <span className="mr-2">GENRES</span>
                <span className="cursor-pointer" onClick={() => removeFilter('genres')}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </span>
              </div>
            )}
            {activeFilters.rating && (
              <div className="bg-gray-700 rounded-full px-3 py-1 flex items-center mr-2">
                <span className="mr-2">RATING</span>
                <span className="cursor-pointer" onClick={() => removeFilter('rating')}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </span>
              </div>
            )}
            {activeFilters.releasYear && (
              <div className="bg-gray-700 rounded-full px-3 py-1 flex items-center mr-2">
                <span className="mr-2">RELEASE YEAR</span>
                <span className="cursor-pointer" onClick={() => removeFilter('releasYear')}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </span>
              </div>
            )}
          </div>

          {/* Movies grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
            {filteredMovies.map(movie => (
              <div className="flex justify-center">
                <MovieCard key={movie.id} id={movie.id} />
              </div>
            ))}
          </div>
          
          {filteredMovies.length === 0 && (
            <div className="text-center mt-10">
              <div className="text-xl">No movies found matching your filters</div>
            </div>
          )}
          
          {filteredMovies.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">
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