import Navbar from "../components/navbar";
import MovieCard from "../components/MovieCard";
import HeroBanner from "../components/HeroBanner";
import { Link } from "react-router-dom";

const HomePage = () => {
  const collections = [
    {
      label: "Новинки 2025 року",
      query: "yearMin=2025&yearMax=2025",
      image: "public/images/banners/minecraft-movie_banner.jpg"
    },
    {
      label: "Голівудське кіно",
      query: "genres=Голівудське",
      image: "public/images/banners/locked_banner.jpeg"
    },
    {
      label: "Найкращий рейтинг",
      query: "rating=9",
      image: "public/images/banners/fight-or-flight_banner.jpg"
    },
    {
      label: "Трилери",
      query: "genres=Жахи,Трилер",
      image: "public/images/banners/sinners_banner.jpg"
    },
    {
      label: "Сімейне фентезі",
      query: "genres=Фентезі,Сімейне",
      image: "public/images/banners/snow-white_banner.jpg"
    },
    {
      label: "Пригодницьке",
      query: "genres=Пригодницьке",
      image: "public/images/banners/avatar-3_banner.jpeg"
    },
    {
      label: "Біографічні драми",
      query: "genres=Драма,Біографічне",
      image: "public/images/banners/queer_banner.jpeg"
    },
    {
      label: "Кіно зі США",
      query: "countries=США",
      image: "public/images/banners/mission-impossible_banner.jpeg"
    },
  ];

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
        
        <h2 className="text-4xl font-light mb-8 text-center">Фільми</h2>
        <div className="flex flex-wrap justify-between gap-6">
          {[...Array(10).keys()].map((i) => (
            <MovieCard key={i + 1} id={i + 1} />
          ))}
        </div>
      </div>
    </Navbar>
  );
};

export default HomePage;