import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { useTheme } from "../components/ThemeContext";
import { AuthContext } from "../components/AuthContext";
import sessionsData from "../../data/SessionsData.json";
import moviesData from "../../data/FilmsData.json";
import Navbar from "../components/navbar";
import MovieCard from "../components/MovieCard";
import screen from "../assets/screen.svg";
import screenDark from "../assets/screen-dark.svg";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
};

const BookingPage = () => {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const { user, login } = useContext(AuthContext);
  const session = sessionsData.find((s) => s.id === Number(id));
  const movie = moviesData.find((m) => m.id === session?.movie_id);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const bookingSuccess = localStorage.getItem('bookingSuccess');
    if (bookingSuccess) {
      const { sessionId, seats } = JSON.parse(bookingSuccess);
      if (sessionId === Number(id)) {
        setBookingMessage(`Ваші квитки з місцями: ${seats.join(", ")} успішно заброньовані✅. Гарного перегляду!`);
        setShowSuccessModal(true);
        localStorage.removeItem('bookingSuccess');
      }
    }
  }, [id]);

  if (!session || !movie) {
    return <div className="text-white p-8">Сеанс не знайдено.</div>;
  }

  const totalSeats = 15;
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);
  const isAvailable = (seat) => session.available_seats.includes(seat);

  const toggleSeat = (seat) => {
    if (!isAvailable(seat) || !user) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/book-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          sessionId: session.id,
          chosenSeats: selectedSeats
        })
      });

      if (!response.ok) throw new Error("Помилка бронювання");

      const data = await response.json();
      login(data.user);
      
      localStorage.setItem('bookingSuccess', JSON.stringify({
        sessionId: session.id,
        seats: selectedSeats
      }));
      sessionStorage.setItem("toastMessage", "Бронювання успішне!")

    } catch (error) {
      setBookingMessage("Виникла помилка під час бронювання. \nБудь ласка, спробуйте ще раз або зверніться до служби підтримки.");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBookingMessage("");
  };

  return (
    <Navbar>
      {/* Основной контент */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8 p-4 md:p-8 text-[var(--text-color)] min-h-screen">
        {/* Левая часть - информация о фильме */}
        <div className="w-full lg:w-1/3">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Бронювання квитків</h1>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 bg-[var(--bg-sidebar-searchPage)] rounded-lg p-4 items-center">
            <div className="w-full md:w-2/3">
              <MovieCard id={movie.id} />
            </div>
            <div className="w-full md:w-2/3 md:pl-4 text-base md:text-lg">
              <p className="mb-1">Дата: {formatDate(session.date)}</p>
              <p className="mb-1">Час: {session.time}</p>
              <p className="mb-1">Зал: {session.hall}</p>
              <p>Ціна: {session.price}₴</p>
            </div>
          </div>
        </div>

        {/* Правая часть - выбор мест */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">{!user ? 'Доступні місця' : 'Оберіть місця'}</h2>
          <div className="bg-[var(--bg-sidebar-searchPage)] rounded-lg p-4">
            <img
              src={isDarkMode ? screen : screenDark}
              alt="Screen"
              className="w-full"
            />
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-x-0 sm:gap-y-5 mb-6 sm:mb-8 justify-items-center">
              {seats.map((seat) => (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  className={`w-12 h-12 sm:w-22 sm:h-16 rounded font-semibold border focus:outline-none text-sm sm:text-base ${
                    isAvailable(seat)
                      ? selectedSeats.includes(seat)
                        ? "bg-green-400 text-white border-green-400"
                        : "bg-green-600 text-white border-green-600"
                      : "bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed"
                  }`}
                >
                  {seat}
                </button>
              ))}
            </div>
            <div className="text-xs sm:text-sm text-[var(--text-color)] mb-4">
              <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 bg-green-600 mr-2"></span>
              вільні місця ({session.price}₴)
              <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 bg-gray-600 ml-4 sm:ml-6 mr-2"></span>
              зайняті місця
            </div>
            
            {!user ? 
              <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-600 p-3 sm:p-4 mb-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-200">
                      Для бронювання квитків необхідно увійти в акаунт
                    </p>
                  </div>
                </div>
              </div>
            :
              <>
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-medium mb-2">Обрані місця:</h3>
                  {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <span
                          key={seat}
                          className="bg-green-600 px-2 py-1 rounded text-xs sm:text-sm"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[var(--text-color)] text-sm sm:text-base">Місця не обрані</p>
                  )}
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full sm:w-auto bg-green-700 hover:bg-green-800 px-4 py-2 rounded text-white font-semibold hover:cursor-pointer text-sm sm:text-base"
                >
                  Забронювати місця
                </button>
              </>
            }
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      {isModalOpen && ( 
        <div className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-navbar-main)] text-[var(--text-color)] p-4 sm:p-6 rounded-md w-full sm:w-2/3 lg:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">
                Помилка бронювання!
              </h3>
              <button
                onClick={closeModal}
                className="text-[var(--text-color)] text-2xl hover:cursor-pointer"
              >
                &times;
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm sm:text-base">{bookingMessage}</pre>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-navbar-main)] text-[var(--text-color)] p-4 sm:p-6 rounded-md w-full sm:w-2/3 lg:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">Бронювання успішне!</h3>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-[var(--text-color)] text-2xl hover:cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="whitespace-pre-line text-sm sm:text-base">{bookingMessage}</div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white hover:cursor-pointer text-sm sm:text-base"
            >
              Зрозуміло
            </button>
          </div>
        </div>
      )}
    </Navbar>
  );
};

export default BookingPage;