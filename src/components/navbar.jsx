import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import logoDark from "../assets/logo-dark.svg";
import home from "../assets/home.svg";
import homeDark from "../assets/home-dark.svg";
import favorite from "../assets/favorite.svg";
import favoriteDark from "../assets/favorite-dark.svg";
import search from "../assets/search.svg";
import searchDark from "../assets/search-dark.svg";
import sessions from "../assets/sessions.svg";
import sessionsDark from "../assets/sessions-dark.svg";
import profile from "../assets/profile.svg";
import profileDark from "../assets/profile-dark.svg";
import sunIcon from "../assets/light.svg";
import moonIcon from "../assets/dark.svg";
import adminDashboardIcon from "../assets/dashboard.svg";
import adminDashboardIconDark from "../assets/dashboard-dark.svg";
import adminMoviesIcon from "../assets/adminMovies.svg";
import adminMoviesIconDark from "../assets/adminMovies-dark.svg";
import { FilmDataContext } from "../FilmDataProvider";
import { AuthContext } from "./AuthContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import LogoutModal from "./LogoutModal";
import { useTheme } from "./ThemeContext";

const Navbar = ({ children }) => {
  const { films } = useContext(FilmDataContext);
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getIcon = (lightIcon, darkIcon) => {
    return isDarkMode ? lightIcon : darkIcon;
  };

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
      <div
        className="w-[100px] text-white flex flex-col items-center"
        style={{ backgroundColor: "var(--bg-navbar-main)" }}
      >
        <div
          className="w-full h-[100px] flex justify-center items-center"
          style={{ backgroundColor: "var(--bg-navbar-header)" }}
        >
          <img src={getIcon(logo, logoDark)} alt="Logo" className="w-15 h-12" />
        </div>

        <ul className="flex flex-col items-center">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-250 ${
                  isActive
                    ? "bg-[var(--color-accent)]"
                    : "hover:bg-[var(--color-accent)]"
                }`
              }
            >
              <img
                src={getIcon(home, homeDark)}
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
                  isActive
                    ? "bg-[var(--color-accent)]"
                    : "hover:bg-[var(--color-accent)]"
                }`
              }
            >
              <img
                src={getIcon(search, searchDark)}
                alt="Search"
                className="w-10 h-10 transition-transform duration-250 group-hover:scale-110"
              />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/sessions"
              className={({ isActive }) =>
                `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-250 ${
                  isActive
                    ? "bg-[var(--color-accent)]"
                    : "hover:bg-[var(--color-accent)]"
                }`
              }
            >
              <img
                src={getIcon(sessions, sessionsDark)}
                alt="Sessions"
                className="w-10 h-10 transition-transform duration-250 group-hover:scale-110"
              />
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-250 ${
                      isActive
                        ? "bg-[var(--color-accent)]"
                        : "hover:bg-[var(--color-accent)]"
                    }`
                  }
                >
                  <img
                    src={getIcon(profile, profileDark)}
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
                      isActive
                        ? "bg-[var(--color-accent)]"
                        : "hover:bg-[var(--color-accent)]"
                    }`
                  }
                >
                  <img
                    src={getIcon(favorite, favoriteDark)}
                    alt="Favorite"
                    className="w-10 h-10 transition-transform duration-250 group-hover:scale-110"
                  />
                </NavLink>
              </li>

              {user.role === "admin" && (
                <>
                  <li>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-250 ${
                          isActive
                            ? "bg-[var(--color-accent)]"
                            : "hover:bg-[var(--color-accent)]"
                        }`
                      }
                    >
                      <img
                        src={getIcon(
                          adminDashboardIcon,
                          adminDashboardIconDark
                        )}
                        alt="Admin Dashboard"
                        className="w-10 h-10 transition-transform duration-250 group-hover:scale-110"
                      />
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/adminMovies"
                      className={({ isActive }) =>
                        `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-250 ${
                          isActive
                            ? "bg-[var(--color-accent)]"
                            : "hover:bg-[var(--color-accent)]"
                        }`
                      }
                    >
                      <img
                        src={getIcon(adminMoviesIcon, adminMoviesIconDark)}
                        alt="Admin Movies"
                        className="w-10 h-10 transition-transform duration-250 group-hover:scale-110"
                      />
                    </NavLink>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <div
          className="w-full h-25 text-white flex items-center justify-between pl-12 pr-6 sticky top-0 z-10"
          style={{ backgroundColor: "var(--bg-navbar-main)" }}
        >
          <div className="relative w-1/3 max-w-md">
            <input
              type="text"
              placeholder="Пошук фільмів..."
              className="w-full py-2 px-4 pl-10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              style={{
                backgroundColor: "var(--bg-navbar-second)",
                color: "var(--text-color)",
              }}
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
              className="rounded-lg border-[2px] border-transparent px-[1.2em] py-[0.6em] cursor-pointer transition-all duration-250 hover:border-[var(--color-accent)] box-border"
              style={{
                backgroundColor: "var(--bg-navbar-second)",
                color: "var(--text-color)",
              }}
            >
              <img
                src={getIcon(sunIcon, moonIcon)}
                alt="Theme Toggle Icon"
                className="w-10 h-10"
              />
            </button>

            {!user ? (
              <>
                <button
                  className="min-w-[120px] px-4 py-3 rounded-lg bg-[#5031D6] cursor-pointer hover:bg-[#6a4ff7] transition-colors"
                  onClick={() => setShowLoginModal(true)}
                >
                  Вхід
                </button>
                <button
                  className="min-w-[120px] px-4 py-3 rounded-lg cursor-pointer hover:bg-[#2a3240] transition-colors border border-[#5031D6]"
                  style={{
                    backgroundColor: "var(--bg-navbar-second)",
                    color: "var(--text-color)",
                  }}
                  onClick={() => setShowRegisterModal(true)}
                >
                  Реєстрація
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="min-w-[120px] px-4 py-3 rounded-lg bg-red-600 cursor-pointer hover:bg-red-700 transition-colors"
              >
                Вийти
              </button>
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
                  onClick={() => (window.location.href = `/movies/${movie.id}`)}
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

        <div className="p-6 flex-1 overflow-auto">{children}</div>

        {showLogoutModal && (
          <LogoutModal
            onConfirm={() => {
              logout();
              setShowLogoutModal(false);
            }}
            onCancel={() => setShowLogoutModal(false)}
          />
        )}

        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            switchToRegister={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
          />
        )}
        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            switchToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
