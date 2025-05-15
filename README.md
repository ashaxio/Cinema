# 🎬 Welcome to CosmoVerse!

## 👥 Team

- Шахнов Артем — team lead, developer
- Захаров Святослав — developer
- Безверхий Олександр — developer
- Чижевський Данило — designer, developer
- Романюк Максим — developer
- Мурган Андрій — developer

---

## 📄 Pages

Preview of the pages without technical details  
_Technical description of the project's functionality is in the following chapter_

### 🏠 Home Page

The main page contains:

- Movie banner
- Movie categories
- Movie list
- Recommendations based on favourite movies

---

### 🔍 Search Page

The page with all movies. You can filter them by:

- Name
- Genre
- Rating
- Release year
- Country

---

### 🎞 Movie Page

Each movie has its own page, where you can see:

- Movie banner
- Its genres, description, and other info
- Trailer
- Actor crew
- Rating box where you can rate the movie and see other reviews

---

### 🎟 Sessions Page

A page where you can view available sessions. You can filter them by:

- Movie name
- Date

---

### 🪑 Booking Page

Here you can choose and book tickets for the selected session.

---

### 🔐 Pages Available After Login

#### 👤 Profile Page

Displays user data and tickets. Here, you can:

- Change your username
- Change your password
- View your tickets

---

#### ❤️ Favourites Page

The page with movies marked by the user.  
It acts as a wishlist where you can save movies you want to watch later,  
or simply the ones you like — your recommendations are based on this list.

---

#### 🛠 Admin Page: Statistics

Visible only to the admin.  
Displays various statistics for analysis.

---

#### 🛠 Admin Page: Movie & Session Editor

Visible only to the admin.  
Allows adding, removing, or editing movies and sessions.

---

## ⚙️ Technicalities

### 🔝 Navbar

Present on every page. It includes:

- Navigation buttons
- Registration and log-in/log-out buttons
- Theme switch: dark mode (default) / light mode

---

### ❌ Not Found Page

Displayed when the address is invalid.

---

### 🎬 Movie Card

Used on most pages. Leads to the respective movie page when clicked.  
Includes:

- Movie poster
- Movie name, release year, rating, genres
- Description shown when hovering over the poster

---

## 📁 Data Files

### 🎞 `FilmsData.json`

Stores data about movies.  
Used by the Home Page, Movie Pages, and Movie Cards.  
Admin can edit it via the Admin page.

#### Example:

```json
{
  "id": 1,
  "title": "Назва",
  "movie_type": "Жанр",
  "eng_title": "Назва англійською",
  "poster": "файл постеру",
  "banner": "файл банеру",
  "short_description": "Коротка версія опису.",
  "description": "Повна, довга версія опису",
  "genre": ["Жанри"],
  "countries": ["Країни"],
  "year": 2025,
  "end_of_showtime": "1 червня",
  "rating": 8,
  "age_rating": "12+",
  "duration": "1:41",
  "release_date": "2025-04-03",
  "display_languages": ["мови озвучення/оригіналу"],
  "subtitle_languages": ["Англійська"],
  "budget": "$15 000 000",
  "premiere": "2025-01-23",
  "studio": ["Студії"],
  "distributor": "Дистрибутор",
  "trailer": "посилання на трейлер",
  "cast": [
    {
      "name": "Ім'я атора(-ки)",
      "role": "Роль",
      "photo": "файл фото актора(-ки)",
      "folder": "папка з відповідними файлами"
    }
  ],
  "director": {
    "name": "Ім'я режисера(-ки)",
    "photo": "файл фото режисера(-ки)"
  },
  "ratings": [],
  "generalRating": 9
}
```

---

### 🕒 `SessionsData.json`

Stores session data.  
Used by Sessions Page and Booking Page.  
Admin can modify it via the Admin page.

#### Example:

```json
{
  "id": 1,
  "movie_id": 1,
  "hall": 1,
  "date": "2025-05-06",
  "time": "09:00",
  "price": 150,
  "available_seats": [1, 15]
}
```

---

### 👥 `users.json`

Stores user data:

- ID
- Name
- Email
- Password
- Role (user/admin)
- Favourite movies
- Tickets

Used by the Profile Page, Favourites Page, Booking Page, and Log-in modal.

#### Example:

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@gmail.com",
  "//password": "Password is 12345678",
  "password": "$2b$10$apo7HQCyBOkfpJxUmDirFOfTftSTuv82oVqG/Y8PaA8rPhimeeLtm",
  "role": "admin",
  "favoriteMovies": [1, 2],
  "tickets": [
    {
      "sessionId": 14,
      "chosenSeats": [1, 2]
    }
  ]
}
```

---

## 🚀 How to Run Locally

1. In the first terminal:

   ```bash
   npm install
   ```

2. In the second terminal:

   ```bash
   node ./server/jsonServer.js
   ```

3. Back in the first terminal:
   ```bash
   npm run dev
   ```
