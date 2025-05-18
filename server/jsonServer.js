import multer from 'multer';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import { addRatingToMovie, getMovies } from "./utils/MovieJsonUtils.js";

import { registerUser, authenticateUser, toggleFavoriteMovie, updateUser, createUserTicket } from "./utils/userUtils.js";
import { getSessions, saveMovies, saveSessions } from "./utils/AdminMoviesUtils.js";

// =============================================
// Ініціалізація додатку та базові налаштування
// =============================================
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filmsFile = path.join(__dirname, '../../data/FilmsData.json');
const sessionsFile = path.join(__dirname, '../../data/SessionsData.json');
const memoryStorage = multer.memoryStorage();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// =============================================
// Допоміжні функції для роботи з файлами
// =============================================
function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// =============================================
// Роути для фільмів
// =============================================
app.get("/movies", async (req, res) => {
  try {
    const movies = await getMovies();
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error in /movies endpoint:', error);
    res.status(500).json({error: error.message});
  }
});

app.put("/movies", async (req, res) => {
  try {
    const updatedMovies = req.body;
    if (!Array.isArray(updatedMovies)) {
      return res.status(400).json({ error: "Expected an array of movies" });
    }
    await saveMovies(updatedMovies);
    res.status(200).json({ message: "Movies updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/movies/add-rating", async (req, res) => {
  try {
    const movieData = req.body;
    await addRatingToMovie(movieData);
    res.status(201).json({message: "Rating has been added to movie successfully"});
  } catch (error) {
    console.error(error);
    res.status(400).json({erro:error.message});
  }
});

// =============================================
// Роути для сеансів
// =============================================
app.get('/sessions', async (req, res) => {
  try {
    const allSessions = await getSessions();
    const { movieId } = req.query;

    if (movieId) {
      const filteredSessions = allSessions.filter(s => s.movie_id === parseInt(movieId));
      res.status(200).json(filteredSessions);
    } else {
      res.status(200).json(allSessions);
    }
  } catch (error) {
    console.error('Error in /sessions endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/sessions", async (req, res) => {
  try {
    const updatedSessions = req.body;
    if (!Array.isArray(updatedSessions)) {
      return res.status(400).json({ error: "Expected an array of sessions" });
    }
    await saveSessions(updatedSessions);
    res.status(200).json({ message: "Sessions updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// Роути для користувачів
// =============================================
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await registerUser(username, email, password);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await authenticateUser(email, password);
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.put("/user/update", async (req, res) => {
  const { id, newUsername, newPassword } = req.body;
  try {
    const updatedUser = await updateUser(id, newUsername, newPassword);
    const userForFrontend = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      favoriteMovies: updatedUser.favoriteMovies,
      tickets: updatedUser.tickets
    };
    res.status(200).json({ message: "User updated", user: userForFrontend });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.put("/user/addFavorite", async (req,res) =>{
  const { userId, movieId, isFavorite } = req.body;
  try {
    const updatedUser = await toggleFavoriteMovie(userId, parseInt(movieId), isFavorite);
    const userForFrontend = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      favoriteMovies: updatedUser.favoriteMovies,
      tickets: updatedUser.tickets
    };
    res.status(200).json({message:"Movie has been added to favorites.", user: userForFrontend});
  } catch(error) {
    console.error(error);
    res.status(400).json({error: error.message});
  }
});

// =============================================
// API роути 
// =============================================
app.get('/api/films', (req, res) => {
  const films = readJSON(filmsFile);
  res.json(films);
});

app.get('/api/sessions', (req, res) => {
  const sessions = readJSON(sessionsFile);
  res.json(sessions);
});

app.put('/api/films/:id', (req, res) => {
  const films = readJSON(filmsFile);
  const filmId = parseInt(req.params.id);
  const index = films.findIndex(f => f.id === filmId);

  if (index === -1) return res.status(404).json({ error: 'Film not found' });
  films[index] = { ...films[index], ...req.body };
  writeJSON(filmsFile, films);
  res.json(films[index]);
});

app.put('/api/sessions/:id', (req, res) => {
  const sessions = readJSON(sessionsFile);
  const sessionId = parseInt(req.params.id);
  const index = sessions.findIndex(s => s.id === sessionId);

  if (index === -1) return res.status(404).json({ error: 'Session not found' });
  sessions[index] = { ...sessions[index], ...req.body };
  writeJSON(sessionsFile, sessions);
  res.json(sessions[index]);
});

// =============================================
// Функції для роботи з файловою системою
// =============================================
function ensureDirExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Directory created: ${dirPath}`);
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    throw error;
  }
}

// =============================================
// Налаштування Multer для завантаження файлів
// =============================================

function uploadToFolder(folderName) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, '..', 'public', 'images', folderName);
      ensureDirExists(dir);
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = file.fieldname + '-' + uniqueSuffix + ext;
      cb(null, filename);
    }
  });
  return multer({ storage });
}

// =============================================
// Роути для завантаження файлів
// =============================================

app.post('/upload/cast-photo', multer({ storage: memoryStorage }).single('photo'), (req, res) => {
  try {
    const file = req.file;
    const movieFolder = sanitizeFolderName(req.body.movieFolder);

    if (!movieFolder) {
      return res.status(400).json({ error: 'Movie folder name is required' });
    }

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ error: 'Invalid file type. Only images are allowed' });
    }

    const filename = `actor-${Date.now()}${ext}`;
    const targetDir = path.join(__dirname, '..', 'public', 'images', 'cast', movieFolder);
    const targetPath = path.join(targetDir, filename);

    ensureDirExists(targetDir);
    fs.writeFileSync(targetPath, file.buffer); // ✅ тепер buffer існує

    const filePath = `/images/cast/${movieFolder}/${filename}`;
    console.log('✅ Actor photo saved to:', targetPath);
    res.status(200).json({ 
      filePath,
      fileName: filename,
      folder: movieFolder
    });

  } catch (error) {
    console.error('❌ Photo upload error:', error);
    res.status(500).json({ 
      error: 'File upload failed',
      details: error.message
    });
  }
});

app.post('/upload/director-photo', multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, '..', 'public', 'images', 'directors');
      ensureDirExists(dir);
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `director-${Date.now()}${ext}`;
      cb(null, filename);
    }
  })
}).single('photo'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = `/images/directors/${req.file.filename}`;
    res.status(200).json({ filePath });
  } catch (error) {
    console.error('❌ Director photo upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/upload/banner', uploadToFolder('banners').single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = `/images/banners/${req.file.filename}`;
  res.status(200).json({ filePath });
});

app.post('/upload/poster', uploadToFolder('posters').single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = `/images/posters/${req.file.filename}`;
  res.status(200).json({ filePath });
});

// Додаємо цю функцію в jsonServer.js
function sanitizeFolderName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')           // Заміна пробілів на дефіси
    .replace(/[^a-z0-9-]/g, '')     // Видалення спецсимволів
    .replace(/-+/g, '-')            // Заміна багатьох дефісів на один
    .replace(/^-+/, '')             // Видалення дефісів з початку
    .replace(/-+$/, '');            // Видалення дефісів з кінця
}

// Оновлюємо маршрут для створення папки фільму
app.post('/create-movie-folder', (req, res) => {
  try {
    const { folderName } = req.body;
    if (!folderName) {
      return res.status(400).json({ error: 'Folder name is required' });
    }

    const sanitizedFolderName = sanitizeFolderName(folderName);
    const castDir = path.join(__dirname, '..', 'public', 'images', 'cast', sanitizedFolderName);
    
    // Створюємо папку для портретів акторів
    ensureDirExists(castDir);

    res.status(200).json({ 
      message: 'Folder created successfully',
      folderName: sanitizedFolderName
    });
  } catch (error) {
    console.error('Error creating movie folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// =============================================
// Статичні файли та запуск сервера
// =============================================
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

app.post("/user/book-ticket", async (req,res) => {
  const { userId, sessionId, chosenSeats} = req.body;

  try{
    const updatedUser = await createUserTicket(userId, sessionId, chosenSeats);
    const userForFrontend = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      favoriteMovies: updatedUser.favoriteMovies,
      tickets: updatedUser.tickets
    }

    res.status(200).json({message: "Ticket has been created succesfully.", user: userForFrontend});
  }catch(error){
    console.error(error);
    res.status(400).json({error: error.message});
  }
});

app.listen(port, () => {
  console.info(`Server app is launched on http://localhost:${port}`);
});