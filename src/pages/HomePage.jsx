import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import HeroBanner from "../components/HeroBanner";
import MovieCard from "../components/MovieCard";
import { FilmDataContext } from "../FilmDataProvider";
import { AuthContext } from "../components/AuthContext";
import sessionsData from "/data/SessionsData.json";

const HomePage = () => {
  const { films } = useContext(FilmDataContext);
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);

  const collections = [
    {
      label: "Новинки 2025 року",
      query: "yearMin=2025&yearMax=2025",
      image: "/images/banners/minecraft-movie_banner.jpg",
    },
    {
      label: "Голівудське кіно",
      query: "genres=Голівудське",
      image: "/images/banners/locked_banner.jpeg",
    },
    {
      label: "Найкращий рейтинг",
      query: "rating=9",
      image: "/images/banners/fight-or-flight_banner.jpg",
    },
    {
      label: "Трилери",
      query: "genres=Жахи,Трилер",
      image: "/images/banners/sinners_banner.jpg",
    },
    {
      label: "Сімейне фентезі",
      query: "genres=Фентезі,Сімейне",
      image: "/images/banners/snow-white_banner.jpg",
    },
    {
      label: "Пригодницьке",
      query: "genres=Пригодницьке",
      image: "/images/banners/avatar-3_banner.jpeg",
    },
    {
      label: "Біографічні драми",
      query: "genres=Драма,Біографічне",
      image: "/images/banners/queer_banner.jpeg",
    },
    {
      label: "Кіно зі США",
      query: "countries=США",
      image: "/images/banners/mission-impossible_banner.jpeg",
    },
  ];

  useEffect(() => {
    if (!films || films.length === 0) return;

    if (!user) {
      const fallback = [...films].sort(() => Math.random() - 0.5).slice(0, 5);
      setRecommendations(fallback);
      return;
    }

    const favoriteMovieIds = user.favoriteMovies || [];
    const bookedMovieIds = user.tickets?.map((ticket) => {
      const session = sessionsData.find((s) => s.id === ticket.sessionId);
      return session?.movie_id;
    }) || [];

    const seenIds = [...new Set([...favoriteMovieIds, ...bookedMovieIds])];

    if (seenIds.length === 0) {
      const fallback = [...films].sort(() => Math.random() - 0.5).slice(0, 5);
      setRecommendations(fallback);
      return;
    }

    const genreCounts = {};
    seenIds.forEach((id) => {
      const film = films.find((f) => f.id === id);
      film?.genre?.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    const sortedGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre);

    const recommended = films
      .filter((film) => {
        if (seenIds.includes(film.id)) return false;
        return film.genre?.some((g) => sortedGenres.includes(g));
      })
      .slice(0, 5);

    setRecommendations(recommended);
  }, [user, films]);

  return (
    <Navbar>
      <div className="p-6 space-y-10">
        <HeroBanner />

        <h2 className="text-4xl font-light mb-8 text-center">Підбірки</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-center">
          {collections.map(({ label, query, image }, index) => (
            <Link key={index} to={`/search?${query}`}>
              <div className="relative group h-64 rounded-lg overflow-hidden shadow-lg hover:scale-[1.02] transition">
                <img
                  src={image}
                  alt={label}
                  className="object-cover w-full h-full group-hover:opacity-60 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <p className="text-white text-lg font-bold text-center px-3">
                    {label}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="text-4xl font-light mt-16 mb-8 text-center">Фільми</h2>
        <div className="flex flex-wrap justify-between gap-6">
          {[...Array(10).keys()].map((i) => (
            <MovieCard key={i + 1} id={i + 1} />
          ))}
        </div>
      </div>

      <h2 className="text-4xl font-light mt-16 mb-8 text-center">Рекомендоване</h2>
        <div className="flex flex-wrap justify-center gap-17">
          {recommendations.map((movie) => (
            <MovieCard key={movie.id} id={movie.id} />
          ))}
        </div>
    </Navbar>
  );
};

export default HomePage;
