import Navbar from "../components/navbar";
import MovieCard from "../components/MovieCard";
import HeroBanner from "../components/HeroBanner"; // ⬅️ новий імпорт

const HomePage = () => {
  return (
    <Navbar>
      <div className="p-6 space-y-10">
        <HeroBanner />
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
