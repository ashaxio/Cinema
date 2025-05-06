import { useContext, useEffect, useState } from "react";
import { FilmDataContext } from "../FilmDataProvider";
import MovieCard from "../components/MovieCard";
import sessionsData from "../../data/SessionsData.json";
import Navbar from "../components/navbar";

const SessionsPage = () => {
  const { films } = useContext(FilmDataContext);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setSessions(sessionsData);
  }, []);

  // Group and sort sessions by movie_id
  const sessionsByMovie = films
    .map((movie) => {
      const movieSessions = sessions
        .filter((s) => s.movie_id === movie.id)
        .sort(
          (a, b) =>
            new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
        );
      return movieSessions.length > 0
        ? { movie, sessions: movieSessions }
        : null;
    })
    .filter(Boolean); // Remove movies with no sessions

  return (
    <Navbar>
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Розклад сеансів</h1>
        <div className="space-y-10">
          {sessionsByMovie.map(({ movie, sessions }) => (
            <div
              key={movie.id}
              className="flex flex-col md:flex-row gap-6 border-b border-gray-600 pb-6"
            >
              <MovieCard id={movie.id} />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Сеанси:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="bg-[#2f2f2f] p-4 rounded-lg shadow border border-transparent hover:border-[#5031D6]"
                    >
                      <div className="flex justify-between text-base text-gray-300">
                        <span>
                          {new Date(s.date).getDate()}{" "}
                          {new Date(s.date).toLocaleString("uk-UA", {
                            month: "short",
                          })}
                        </span>
                        <span>{s.time}</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        {s.additional_info}
                      </p>
                      <p className="text-sm text-gray-300 font-semibold">
                        {s.price}₴
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Navbar>
  );
};

export default SessionsPage;
