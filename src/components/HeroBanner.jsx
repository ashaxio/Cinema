import { useContext, useEffect, useState } from "react";
import { FilmDataContext } from "../FilmDataProvider";
import { Link } from "react-router-dom";
import starIcon from "../assets/star.svg";

const HeroBanner = () => {
  const { films } = useContext(FilmDataContext);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [index, films.length]);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + films.length) % films.length);
      setFade(true);
    }, 300);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % films.length);
      setFade(true);
    }, 300);
  };

  if (!films || films.length === 0) return null;

  const currentFilm = films[index];
  const year = currentFilm.release_date?.split("-")[0] || "";
  const genres = currentFilm.genre?.join(", ");
  const rating = currentFilm.generalRating || currentFilm.rating;
  const ageRating = currentFilm.age_rating || "Not Rated";
  const duration = currentFilm.duration || "N/A";

  return (
    <div className="relative w-full h-[75vh] overflow-hidden rounded-xl shadow-lg mb-10">
      {/* Fade container */}
      <div
        key={currentFilm.id}
        className={`absolute inset-0 transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"}`}
      >
        <img
          src={currentFilm.banner}
          alt={currentFilm.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>

        {/* Text content */}
        <div className="absolute left-50 right-50 bottom-22 z-20 text-white text-center">
          <h1 className="text-5xl font-bold mb-2">{currentFilm.title}</h1>
          <p className="text-lg mb-4">{year} • {genres} • {duration}</p>
          <div className="flex justify-center items-center gap-2 mb-4">
            {rating && (
              <>
                <img src={starIcon} alt="star" className="w-5 h-5" />
                <span className="text-xl font-bold">{rating}/<span className="text-lg font-semibold">{10}</span></span>
              </>
            )}
          </div>
          <Link
            to={`/movies/${currentFilm.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5031D6] text-white font-medium rounded-lg hover:bg-[#6c4aff] transition"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Background semi-circle with transparency */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60%] h-[55vh] bg-gradient-to-t from-black/80 bg-opacity-30 rounded-t-full z-0"></div>

      {/* Prev / Next buttons */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 text-white bg-black/30 hover:bg-[#5031D6] p-3 rounded-full transition"
        onClick={handlePrev}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 text-white bg-black/30 hover:bg-[#5031D6] p-3 rounded-full transition"
        onClick={handleNext}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators on the semi-circle */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {films.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setIndex(i);
                setFade(true);
              }, 300);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-[#5031D6]" : "bg-gray-400 hover:bg-[#ffffff]"
            }`}
          />
        ))}
      </div>

      {/* Age rating displayed in the bottom-left corner */}
      <div className="absolute bottom-6 left-6 z-30 text-white bg-black/40 px-4 py-2 rounded-lg">
        <span className="text-lg font-semibold">{ageRating}</span>
      </div>
    </div>
  );
};

export default HeroBanner;
