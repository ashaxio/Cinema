import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import home from "../assets/home.svg";
import favorite from "../assets/favorite.svg";
import search from "../assets/search.svg";
import noName from "../assets/no-name.svg";

const Navbar = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="w-[100px] bg-[#0f1827] text-white flex flex-col items-center">
        <div className="bg-[#435571] w-full h-[100px] flex justify-center items-center">
          <img src={logo} alt="Logo" className="w-15 h-12" />
        </div>

        <ul className="flex flex-col items-center">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-200 ${
                  isActive ? "bg-[#5031D6]" : "hover:bg-[#5031D6]"
                }`
              }
            >
              <img
                src={home}
                alt="Home"
                className="w-10 h-10 transition-transform duration-200 group-hover:scale-110"
              />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-200 ${
                  isActive ? "bg-[#5031D6]" : "hover:bg-[#5031D6]"
                }`
              }
            >
              <img
                src={search}
                alt="Search"
                className="w-10 h-10 transition-transform duration-200 group-hover:scale-110"
              />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/noname"
              className={({ isActive }) =>
                `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-200 ${
                  isActive ? "bg-[#5031D6]" : "hover:bg-[#5031D6]"
                }`
              }
            >
              <img
                src={noName}
                alt="No Name"
                className="w-10 h-10 transition-transform duration-200 group-hover:scale-110"
              />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `group w-[100px] h-[100px] flex justify-center items-center transition-colors duration-200 ${
                  isActive ? "bg-[#5031D6]" : "hover:bg-[#5031D6]"
                }`
              }
            >
              <img
                src={favorite}
                alt="Favorite"
                className="w-10 h-10 transition-transform duration-200 group-hover:scale-110"
              />
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col overflow-x-hidden">
        <div className="w-screen h-25 bg-[#0f1827] text-white flex items-center pl-20 sticky top-0 z-10"></div>
        <div className="p-6 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Navbar;
