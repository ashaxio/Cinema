import { useParams } from "react-router-dom";
import { useState } from "react";
import sessionsData from "../../data/SessionsData.json";
import moviesData from "../../data/FilmsData.json";
import Navbar from "../components/navbar";
import MovieCard from "../components/MovieCard";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
};

const BookingPage = () => {
  const { id } = useParams();
  const session = sessionsData.find((s) => s.id === Number(id));
  const movie = moviesData.find((m) => m.id === session?.movie_id);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!session || !movie) {
    return <div className="text-white p-8">Сеанс не знайдено.</div>;
  }

  const totalSeats = 15;
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);
  const isAvailable = (seat) => session.available_seats.includes(seat);

  const toggleSeat = (seat) => {
    if (!isAvailable(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = () => {
    // Set booking message
    setBookingMessage(
      `Session ID: ${session.id}\nChosen seats: ${selectedSeats.join(", ")}`
    );
    // Open the modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBookingMessage("");
  };

  return (
    <Navbar>
      <div className="flex gap-12 p-8 text-white min-h-screen">
        {/* Left Side */}
        <div className="w-1/3">
          <h1 className="text-3xl font-bold mb-6">Бронювання квитків</h1>
          <div className="flex gap-6 bg-gray-800 rounded-lg p-4 items-center">
            <div className="w-2/3">
              <MovieCard id={movie.id} />
            </div>
            <div className="w-2/3 pl-4 text-lg">
              <p className="mb-1">Дата: {formatDate(session.date)}</p>
              <p className="mb-1">Час: {session.time}</p>
              <p className="mb-1">Зал: {session.hall}</p>
              <p>Ціна: {session.price}₴</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Оберіть місця</h2>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-center text-gray-400 mb-4">Екран тут ↑</div>
            <div className="grid grid-cols-5 gap-x-0 gap-y-5 mb-8 justify-items-center">
              {seats.map((seat) => (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  className={`w-22 h-16 rounded font-semibold border focus:outline-none ${
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
            <div className="text-sm text-gray-300 mb-4">
              <span className="inline-block w-4 h-4 bg-green-600 mr-2"></span>
              вільні місця ({session.price}₴)
              <span className="inline-block w-4 h-4 bg-gray-600 ml-6 mr-2"></span>
              зайняті місця
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Обрані місця:</h3>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="bg-green-600 px-2 py-1 rounded text-sm"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Місця не обрані</p>
              )}
            </div>
            <button
              onClick={handleBooking}
              className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded text-white font-semibold"
            >
              Забронювати місця
            </button>
          </div>
        </div>
      </div>

      {/* Modal (Overlay Box) */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-md w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Підтвердження бронювання
              </h3>
              <button onClick={closeModal} className="text-white text-2xl">
                &times;
              </button>
            </div>
            <pre>{bookingMessage}</pre>
          </div>
        </div>
      )}
    </Navbar>
  );
};

export default BookingPage;
