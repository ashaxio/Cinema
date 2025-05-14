import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../components/AuthContext";
import { useTheme } from "../components/ThemeContext";
import Navbar from "../components/navbar";
import ChangeUsernameModal from "../components/ChangeUsernameModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import avatarIcon from "../assets/person.svg";
import avatarIconDark from "../assets/person-dark.svg";
import moviesData from "../../data/FilmsData.json";
import sessionsData from "../../data/SessionsData.json";

const ProfilePage = () => {
  const { isDarkMode } = useTheme();
  const { user, login } = useContext(AuthContext);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userTickets, setUserTickets] = useState([]);

  useEffect(() => {
    if (user?.tickets) {
      const enrichedTickets = user.tickets.map(ticket => {
        const session = sessionsData.find(s => s.id === ticket.sessionId);
        const movie = moviesData.find(m => m.id === session?.movie_id);
        return {
          ...ticket,
          session,
          movie,
          totalPrice: ticket.chosenSeats.length * (session?.price || 0)
        };
      });
      setUserTickets(enrichedTickets);
    }
  }, [user]);

  if (!user) {
    return (
      <Navbar>
        <div className="text-white p-6">Loading user data...</div>
      </Navbar>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <Navbar>
      <div className="flex flex-col lg:flex-row gap-8 p-8">
        {/* Profile section */}
        <div className="bg-[var(--bg-navbar-main)] text-[var(--text-color)] p-8 rounded-2xl shadow-2xl w-full lg:w-1/3 h-fit transition-all duration-300">
          <div className="flex flex-col items-center mb-6">
            <img
              src={isDarkMode ? avatarIcon : avatarIconDark}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-[var(--color-accent)] mb-4"
            />
            <h1 className="text-3xl font-bold">Мій профіль</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-[var(--text-color)] mb-1">
                Ім'я користувача
              </label>
              <div className="flex justify-between items-center bg-[var(--bg-navbar-second)] p-3 rounded-lg">
                <span className="text-lg">{user.username}</span>
                <button
                  onClick={() => setShowUsernameModal(true)}
                  className={`text-sm ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  } hover:underline`}
                >
                  Змінити
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-color)] mb-1">
                Email
              </label>
              <div className="bg-[var(--bg-navbar-second)] p-3 rounded-lg text-lg">
                {user.email}
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-color)] mb-1">
                Роль
              </label>
              <div className="bg-[var(--bg-navbar-second)] p-3 rounded-lg text-lg flex items-center gap-2">
                {user.role === "admin" ? "🛠️ Адміністратор" : "👤 Користувач"}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowPasswordModal(true)}
                className={`text-sm ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                  } hover:underline`}
                >
                Змінити пароль
              </button>
            </div>
          </div>
        </div>

        {/* Секція квитків */}
        <div className="bg-[var(--bg-navbar-main)] text-[var(--text-color)] p-8 rounded-2xl shadow-2xl w-full lg:w-2/3 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-6">Мої квитки</h2>
          
          {userTickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg">У вас ще немає зарезервованих квитків</p>
              <p className="text-sm text-gray-500 mt-2">Після бронювання квитки з'являться тут</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userTickets.map((ticket, index) => (
                <div key={index} className="bg-[var(--bg-navbar-second)] rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{ticket.movie?.title || "Невідомий фільм"}</h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div>
                          <span className="text-sm text-gray-500">Дата: </span>
                          <span>{formatDate(ticket.session?.date)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Час: </span>
                          <span>{ticket.session?.time}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Зал: </span>
                          <span>{ticket.session?.hall}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-medium">{ticket.totalPrice}₴</div>
                      <div className="text-sm text-gray-500">
                        {ticket.chosenSeats.length} місць
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {ticket.chosenSeats.map((seat, seatIndex) => (
                        <span 
                          key={seatIndex} 
                          className="bg-green-600 text-white px-3 py-1 rounded-full text-sm"
                        >
                          Місце {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showUsernameModal && (
        <ChangeUsernameModal
          currentUsername={user.username}
          userId={user.id}
          onSuccess={(updatedUser) => login(updatedUser)}
          onClose={() => setShowUsernameModal(false)}
        />
      )}
      {showPasswordModal && (
        <ChangePasswordModal
          userId={user.id}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </Navbar>
  );
};

export default ProfilePage;