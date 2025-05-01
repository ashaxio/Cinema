import fs from "fs/promises";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function getUsers() {
  try {
    const data = await fs.readFile("../data/users.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error("Error reading users data");
  }
}

export async function saveUsers(users) {
  try {
    const json = JSON.stringify(users, null, 2);
    await fs.writeFile("../data/users.json", json, "utf-8");
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

  const user = users.find((user) => user.email === email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    "q9Jw@R8u#Zm!L2nDf7Vt^Ke3Xp0$sPwA",
    {
      expiresIn: "1h",
    }
  );

  return token;
}
