import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { addRatingToMovie, getMovies } from "./utils/MovieJsonUtils.js";
import { registerUser, authenticateUser } from "./utils/userUtils.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//TESTING END POINT
app.get("/movies", async (req, res) => {
  try {
    const movies = await getMovies();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error reading movies data");
  }
});

app.put("/movies/add-rating", async (req, res) => {
  try {
    const movieData = req.body;

    const result = await addRatingToMovie(movieData);

    if (!result) res.sendStatus(404);
    else res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding rating to the movie");
  }
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await registerUser(username, email, password);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authenticateUser(email, password);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.info(`Server app is launched on http://localhost:${port}`);
});