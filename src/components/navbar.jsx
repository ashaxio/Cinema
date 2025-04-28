import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom"; 
import logo from "../assets/logo.svg";
import home from "../assets/home.svg";
import favorite from "../assets/favorite.svg";
import search from "../assets/search.svg";
import profile from "../assets/profile.svg";
import sunIcon from "../assets/light.svg";
import moonIcon from "../assets/dark-white.svg";
import { FilmDataContext } from "../FilmDataProvider";

const Navbar = ({ userId, children }) => {
  const { films } = useContext(FilmDataContext);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (searchQuery) {
      const results = films.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(results);
    } else {
      setFilteredMovies([]);
    }
  }, [searchQuery, films]);

  return (
    <div className="flex h-screen w-screen">
      <div className="w-[100px] bg-[#0f1827] text-white flex flex-col items-center">
        <div className="bg-[#435571] w-full h-[100px] flex justify-center items-center">
          <img src={logo} alt="Logo" className="w-15 h-12" />
        </div>

        <ul className="flex flex-col items-center">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-250 ${
                  isActive ? "bg-[#5031D6]" : "hover:bg-[#5031D6]"
                }`
              }
            >
              <img
                src={home}
                alt="Home"
                className="w-10 h-10 transition-transform duration-250 group-hover:scale-110"
              />
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-250 ${
                  isActive ? "bg-[#5031D6]" : "hover:bg-[#5031D6]"
                }`
              }
            >
              <img
                src={search}
                alt="Search"
                className="w-10 h-10 transition-transform duration-250 group-hover:scale-110"
              />
            </NavLink>
          </li>

          {userId && (
            <>
              <li>
                <NavLink
                  to={`/profile/${userId}`}
                  className={({ isActive }) =>
                    `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-250 ${
                      isActive ? "bg-[#5031D6]" : "hover:bg-[#5031D6]"
                    }`
                  }
                >
                  <img
                    src={profile}
                    alt="Profile"
                    className="w-10 h-10 transition-transform duration-250 group-hover:scale-110"
                  />
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-250 ${
                      isActive ? "bg-[#5031D6]" : "hover:bg-[#5031D6]"
                    }`
                  }
                >
                  <img
                    src={favorite}
                    alt="Favorite"
                    className="w-10 h-10 transition-transform duration-250 group-hover:scale-110"
                  />
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <div className="w-full h-25 bg-[#0f1827] text-white flex items-center justify-between pl-12 pr-6 sticky top-0 z-10">
          <div className="relative w-1/3 max-w-md">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full py-2 px-4 pl-10 rounded-lg bg-[#192231] text-white focus:outline-none focus:ring-2 focus:ring-[#5031D6]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-lg border-[2px] border-transparent px-[1.2em] py-[0.6em] bg-[#192231] cursor-pointer transition-all duration-250 hover:border-[#5031D6] box-border"
            >
              <img
                src={isDarkMode ? sunIcon : moonIcon}
                alt="Theme Toggle Icon"
                className="w-10 h-10"
              />
            </button>

            {!userId && (
              <>
                <button className="px-4 py-2 rounded-lg bg-[#5031D6] hover:bg-[#6a4ff7] transition-colors">
                  Login
                </button>
                <button className="px-4 py-2 rounded-lg bg-[#192231] hover:bg-[#2a3240] transition-colors border border-[#5031D6]">
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {filteredMovies.length > 0 && (
          <div 
            className="absolute bg-white text-black mt-2 rounded-lg z-10 max-h-60 overflow-auto 
            top-[70px] left-[149px] w-[350px] rounded-[10px]"
          >
            <ul className="list-none p-2">
              {filteredMovies.map((movie) => (
                <li
                  key={movie.id}
                  className="cursor-pointer py-2 px-4 hover:bg-violet-100 hover:rounded-lg flex items-center"
                  onClick={() => window.location.href = `/movies/${movie.id}`}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-12 h-12 object-cover inline-block mr-4"
                  />
                  <span>{movie.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-6 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Navbar;
