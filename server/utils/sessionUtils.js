import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../../data/SessionsData.json");

export async function getSessions(){
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error("Помилка читання даних сеансів");
  }
}

export async function saveSessions(sessions) {
  try {
    const json = JSON.stringify(sessions, null, 2);
    await fs.writeFile(filePath, json, "utf-8");
  } catch (error) {
    console.error(error);
    throw new Error("Помилка збереження даних сеансів");
  }
}

export async function removeSelectedSeatsFromSession(sessionId, chosenSeats){
    if(chosenSeats.length === 0) throw new Error("Вибрані місця відсутні")
    const sessions = await getSessions();
    const sessionIndex = sessions.findIndex((s)=> s.id === sessionId);
    if(sessionIndex === -1) throw new Error("Сеанс не знайдено");

    sessions[sessionIndex].available_seats = 
                sessions[sessionIndex].available_seats.filter((seat) => !chosenSeats.includes(seat))

    await saveSessions(sessions);
}