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
import { AuthContext } from "./AuthContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import LogoutModal from "./LogoutModal";

const Navbar = ({ children }) => {
  const { films } = useContext(FilmDataContext);
  const { user, logout } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // const navigate = useNavigate();

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

          {user && (
            <>
              <li>
                <NavLink
                  to={`/profile/${user.id}`}
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

            {!user ? (
              <>
                <button
                  className="min-w-[120px] px-4 py-3 rounded-lg bg-[#5031D6] cursor-pointer hover:bg-[#6a4ff7] transition-colors"
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </button>
                <button
                  className="min-w-[120px] px-4 py-3 rounded-lg bg-[#192231] cursor-pointer hover:bg-[#2a3240] transition-colors border border-[#5031D6]"
                  onClick={() => setShowRegisterModal(true)}
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="min-w-[120px] px-4 py-3 rounded-lg bg-red-600 cursor-pointer hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="p-6 flex-1 overflow-auto">{children}</div>

        {/* Logout confirmation modal */}
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
