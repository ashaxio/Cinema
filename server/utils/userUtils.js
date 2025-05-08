import fs from "fs/promises";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../../data/users.json");

export async function getUsers() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error("Error reading users data");
  }
}

export async function saveUsers(users) {
  try {
    const json = JSON.stringify(users, null, 2);
    await fs.writeFile(filePath, json, "utf-8");
  } catch (error) {
    console.error(error);
    throw new Error("Error saving users data");
  }
}

export async function registerUser(username, email, password) {
  const users = await getUsers();

  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    role: "user",
  };

  users.push(newUser);
  await saveUsers(users);

  return newUser;
}

export async function authenticateUser(email, password) {
  const users = await getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("Invalid email or password");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  const payload = { id: user.id, username: user.username, role: user.role };
  const token = jwt.sign(payload, "q9Jw@R8u#Zm!L2nDf7Vt^Ke3Xp0$sPwA", {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

export async function updateUser(id, newUsername, newPassword) {
  const users = await getUsers();
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) throw new Error("User not found");

  if (newUsername) {
    users[userIndex].username = newUsername;
  }

  if (newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;
  }

  await saveUsers(users);
  return users[userIndex];
}
