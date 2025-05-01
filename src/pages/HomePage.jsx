import Navbar from "../components/navbar";
import MovieCard from "../components/MovieCard";

const HomePage = () => {
  return (
    <>
      <Navbar>
        <div className="flex flex-wrap justify-between gap-6 p-6">
          <MovieCard id={1} />
          <MovieCard id={2} />
          <MovieCard id={3} />
          <MovieCard id={4} />
          <MovieCard id={5} />
          <MovieCard id={6} />
          <MovieCard id={7} />
          <MovieCard id={8} />
          <MovieCard id={9} />
          <MovieCard id={10} />
        </div>
      </Navbar>
    </>
  );
};

export default HomePage;
