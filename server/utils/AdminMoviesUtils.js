import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filmsFilePath = path.join(__dirname, '../../data/FilmsData.json');
const sessionsFilePath = path.join(__dirname, '../../data/SessionsData.json');

// Допоміжна функція для читання і парсингу JSON
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw new Error(`Failed to read ${path.basename(filePath)}`);
  }
}

// Допоміжна функція для запису JSON
async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    throw new Error(`Failed to update ${path.basename(filePath)}`);
  }
}

// Отримати всі фільми
export async function getMovies() {
  return await readJsonFile(filmsFilePath);
}

// Отримати всі сесії
export async function getSessions() {
  const sessions = await readJsonFile(sessionsFilePath);
  console.debug(`Loaded ${sessions.length} sessions from file`);
  return sessions;
}

// Зберегти фільми
export async function saveMovies(movies) {
  if (!Array.isArray(movies)) {
    throw new Error('Movies data must be an array');
  }
  await writeJsonFile(filmsFilePath, movies);
  console.log(`Successfully saved ${movies.length} movies`);
}

// Зберегти сесії
export async function saveSessions(sessions) {
  if (!Array.isArray(sessions)) {
    throw new Error('Sessions data must be an array');
  }
  await writeJsonFile(sessionsFilePath, sessions);
  console.log(`Successfully saved ${sessions.length} sessions`);
}
