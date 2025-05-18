import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';

const AdminMovies = () => {
  const [selectedSession, setSelectedSession] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [localMovie, setLocalMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [localSessions, setLocalSessions] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingActor, setEditingActor] = useState(null);
  const [newActor, setNewActor] = useState({
    name: '',
    role: '',
    photo: '',
    folder: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [directorPhotoPreview, setDirectorPhotoPreview] = useState(null);
  const [actorPhotoPreview, setActorPhotoPreview] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderCreationStatus, setFolderCreationStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesResponse = await fetch('http://localhost:3000/movies');
        const moviesData = await moviesResponse.json();
        setMovies(moviesData);

        const sessionsResponse = await fetch('http://localhost:3000/sessions');
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);

  const getImagePath = (imageName, folder = 'posters') => {
    if (!imageName) return '';

    // Спеціальна логіка для вкладених шляхів
    if (folder.startsWith('cast/')) {
      return `/images/${folder}/${imageName}`; // /images/cast/suicidesquad/photo.jpg
    }

    if (folder === 'directors') {
      return `/images/directors/${imageName}`;
    }

    return `/images/${folder}/${imageName}`;
  };

  const saveMoviesToServer = async (updatedMovies) => {
    const response = await fetch('http://localhost:3000/movies', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMovies),
    });
    if (!response.ok) throw new Error('Failed to save movies');
    return await response.json();
  };

  const saveSessionsToServer = async (updatedSessions) => {
    const response = await fetch('http://localhost:3000/sessions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSessions),
    });
    if (!response.ok) throw new Error('Failed to save sessions');
    return await response.json();
  };

const createMovieFolder = async () => {
  try {
    const response = await fetch('http://localhost:3000/create-movie-folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folderName: newFolderName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const createdFolder = data.folderName;
    setFolderCreationStatus(`Папка "${createdFolder}" успішно створена!`);

    if (localMovie) {
      setLocalMovie({
        ...localMovie,
        cast: localMovie.cast.map(actor => ({
          ...actor,
          folder: actor.folder || createdFolder
        }))
      });
    }

    setNewActor(prev => ({ ...prev, folder: createdFolder }));

    setTimeout(() => {
      setShowFolderModal(false);
      setFolderCreationStatus('');
      setNewFolderName('');
    }, 2000);
  } catch (error) {
    console.error('Error creating folder:', error);
    setFolderCreationStatus(`Помилка: ${error.message}`);
  }
};


  const handleMovieSelect = (movieId) => {
    const movie = movies.find(film => film.id === movieId);
    setSelectedMovie(movie);
    setLocalMovie({...movie});
    setBannerPreview(movie.banner ? getImagePath(movie.banner, 'banners') : null);
    setPosterPreview(movie.poster ? getImagePath(movie.poster) : null);
    setDirectorPhotoPreview(movie.director?.photo ? getImagePath(movie.director.photo, movie.cast[0]?.folder || '') : null);
    setHasChanges(false);

    if (Array.isArray(sessions)) {
      const filteredSessions = sessions.filter(session => session.movie_id === movieId);
      setSelectedSession(filteredSessions);
      setLocalSessions(filteredSessions.map(s => ({...s})));
    } else {
      setSelectedSession([]);
      setLocalSessions([]);
    }
  };

  const handleMovieEdit = (field, value) => {
    if (!localMovie) return;
    
    const updatedMovie = { ...localMovie, [field]: value };
    setLocalMovie(updatedMovie);
    setHasChanges(true);
  };

  const handleAddMovie = async () => {
    const newMovie = {
      id: Math.max(...movies.map(m => m.id), 0) + 1,
      title: 'Новий фільм',
      movie_type: '',
      eng_title: '',
      poster: '',
      banner: '',
      short_description: '',
      description: '',
      genre: [],
      countries: [],
      year: new Date().getFullYear(),
      end_of_showtime: '',
      rating: 0,
      age_rating: '',
      duration: '',
      release_date: new Date().toISOString().split('T')[0],
      display_languages: [],
      subtitle_languages: [],
      budget: '',
      premiere: '',
      studio: [],
      distributor: '',
      trailer: '',
      cast: [],
      director: {
        name: '',
        photo: ''
      }
    };
    
    const updatedMovies = [...movies, newMovie];
    
    try {
      await saveMoviesToServer(updatedMovies);
      setMovies(updatedMovies);
      setSelectedMovie(newMovie);
      setLocalMovie({...newMovie});
      setHasChanges(false);
      showSuccessNotification('Фільм успішно додано');
    } catch (error) {
      console.error(error);
      showSuccessNotification('Помилка при додаванні фільму');
    }
  };

  const confirmDeleteMovie = (movieId) => {
    setMovieToDelete(movieId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteMovie = async () => {
    const movieId = movieToDelete;
    const updatedMovies = movies.filter(movie => movie.id !== movieId);
    const updatedSessions = sessions.filter(session => session.movie_id !== movieId);
    
    try {
      await saveMoviesToServer(updatedMovies);
      await saveSessionsToServer(updatedSessions);
      
      setMovies(updatedMovies);
      setSessions(updatedSessions);
      
      if (selectedMovie?.id === movieId) {
        setSelectedMovie(null);
        setLocalMovie(null);
        setSelectedSession([]);
        setLocalSessions([]);
      }
      
      setShowDeleteConfirm(false);
      showSuccessNotification('Фільм успішно видалено');
    } catch (error) {
      console.error(error);
      showSuccessNotification('Помилка при видаленні фільму');
    }
  };

  const handleAddActor = () => {
    if (!localMovie) return;
    
    const updatedMovie = {
      ...localMovie,
      cast: [...localMovie.cast, {
        ...newActor,
        folder: newActor.folder || localMovie.cast[0]?.folder || ''
      }]
    };
    
    setLocalMovie(updatedMovie);
    setNewActor({ name: '', role: '', photo: '', folder: '' });
    setActorPhotoPreview(null);
    setHasChanges(true);
  };

  const handleEditActor = (index) => {
    setEditingActor(index);
    setNewActor(localMovie.cast[index]);
    setActorPhotoPreview(localMovie.cast[index].photo ? 
      getImagePath(localMovie.cast[index].photo, localMovie.cast[index].folder) : null);
  };

  const handleUpdateActor = () => {
    if (editingActor === null || !localMovie) return;
    
    const updatedCast = [...localMovie.cast];
    updatedCast[editingActor] = newActor;
    
    const updatedMovie = {
      ...localMovie,
      cast: updatedCast
    };
    
    setLocalMovie(updatedMovie);
    setEditingActor(null);
    setNewActor({ name: '', role: '', photo: '', folder: '' });
    setActorPhotoPreview(null);
    setHasChanges(true);
  };

  const handleDeleteActor = (index) => {
    if (!localMovie) return;
    
    const updatedCast = [...localMovie.cast];
    updatedCast.splice(index, 1);
    
    const updatedMovie = {
      ...localMovie,
      cast: updatedCast
    };
    
    setLocalMovie(updatedMovie);
    setHasChanges(true);
  };

  const handleActorInputChange = (e) => {
    const { name, value } = e.target;
    setNewActor(prev => ({ ...prev, [name]: value }));
  };

  const handleSessionEdit = (sessionId, field, value) => {
    const updatedSessions = localSessions.map(session => 
      session.id === sessionId ? { ...session, [field]: value } : session
    );
    
    setLocalSessions(updatedSessions);
    setHasChanges(true);
  };

  const handleAddSession = () => {
    if (!localMovie) return;
    
    const newSession = {
      id: Math.max(...sessions.map(s => s.id), 0) + 1,
      movie_id: localMovie.id,
      date: new Date().toISOString().split('T')[0],
      time: '15:00',
      price: 10,
      available_seats: ['A1', 'A2', 'A3'],
    };
    
    setLocalSessions([...localSessions, newSession]);
    setHasChanges(true);
  };

  const confirmDeleteSession = (sessionId) => {
    setSessionToDelete(sessionId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteSession = () => {
    const sessionId = sessionToDelete;
    const updatedSessions = localSessions.filter(session => session.id !== sessionId);
    
    setLocalSessions(updatedSessions);
    setShowDeleteConfirm(false);
    setHasChanges(true);
  };

  const handleFileUpload = async (field, file, folder = '') => {
    if (!localMovie || !file) return;

    if ((field === 'actorPhoto' || field === 'directorPhoto') && !folder && !localMovie.cast?.[0]?.folder) {
      alert('Будь ласка, спочатку створіть папку для фільму або вкажіть папку для актора');
      return;
    }

    const isCastPhoto = field === 'actorPhoto' || field === 'directorPhoto';
    const formData = new FormData();
    const folderToUse = folder || localMovie.cast?.[0]?.folder; 

    formData.append(isCastPhoto ? 'photo' : 'file', file);
    if (isCastPhoto) {
      formData.append('movieFolder', folderToUse);
      console.log('📁 Uploading to movieFolder:', folderToUse);
    }

    let uploadEndpoint;
    switch (field) {
      case 'banner': uploadEndpoint = '/upload/banner'; break;
      case 'poster': uploadEndpoint = '/upload/poster'; break;
      case 'directorPhoto': uploadEndpoint = '/upload/director-photo'; break;
      case 'actorPhoto': uploadEndpoint = '/upload/cast-photo'; break;
      default: return;
    }

    try {
      const response = await fetch(`http://localhost:3000${uploadEndpoint}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const fileName = data.filePath.split('/').pop();

      if (field === 'directorPhoto') {
        setLocalMovie(prev => ({
          ...prev,
          director: {
            ...prev.director,
            photo: fileName
          }
        }));
        const reader = new FileReader();
        reader.onloadend = () => setDirectorPhotoPreview(reader.result);
        reader.readAsDataURL(file);
      } else if (field === 'actorPhoto') {
        setNewActor(prev => ({ 
          ...prev, 
          photo: fileName, 
          folder: folderToUse // Використовуємо визначену папку
        }));
        const reader = new FileReader();
        reader.onloadend = () => setActorPhotoPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        const updatedMovie = { ...localMovie, [field]: fileName };
        setLocalMovie(updatedMovie);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (field === 'banner') setBannerPreview(reader.result);
          if (field === 'poster') setPosterPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }

      setHasChanges(true);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Помилка завантаження файлу. Перевірте, чи вказано правильну папку.');
    }
  };

  const handleSaveChanges = async () => {
    if (!localMovie || !hasChanges) return;
    
    try {
      const updatedMovies = movies.map(movie => 
        movie.id === localMovie.id ? localMovie : movie
      );
      await saveMoviesToServer(updatedMovies);
      
      const otherSessions = sessions.filter(s => s.movie_id !== localMovie.id);
      const updatedSessions = [...otherSessions, ...localSessions];
      await saveSessionsToServer(updatedSessions);
      
      setMovies(updatedMovies);
      setSessions(updatedSessions);
      setSelectedMovie(localMovie);
      setSelectedSession(localSessions);
      setHasChanges(false);
      
      showSuccessNotification('Зміни успішно збережено');
    } catch (error) {
      console.error(error);
      showSuccessNotification('Помилка при збереженні змін');
    }
  };

  const handleCancelChanges = () => {
    if (selectedMovie) {
      setLocalMovie({...selectedMovie});
      setLocalSessions(selectedSession.map(s => ({...s})));
      setBannerPreview(selectedMovie.banner ? getImagePath(selectedMovie.banner, 'banners') : null);
      setPosterPreview(selectedMovie.poster ? getImagePath(selectedMovie.poster) : null);
      setDirectorPhotoPreview(
        selectedMovie.director?.photo ? 
        getImagePath(selectedMovie.director.photo, selectedMovie.cast[0]?.folder || '') : 
        null
      );
    }
    setHasChanges(false);
  };

  const showSuccessNotification = (message) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleArrayInputChange = (field, value, separator = ',') => {
    if (!localMovie) return;
    
    const updatedMovie = { 
      ...localMovie, 
      [field]: value.split(separator).map(item => item.trim()) 
    };
    setLocalMovie(updatedMovie);
    setHasChanges(true);
  };

  const handleDirectorChange = (field, value) => {
    if (!localMovie) return;
    
    const updatedMovie = { 
      ...localMovie, 
      director: {
        ...localMovie.director,
        [field]: value
      }
    };
    setLocalMovie(updatedMovie);
    setHasChanges(true);
  };

  return (
    <Navbar>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800 p-4 rounded-lg shadow mb-5">
          <h1 className="text-2xl font-bold">Адмін панель кінотеатру</h1>
          {hasChanges && (
            <div className="flex gap-3 mt-3 md:mt-0">
              <button 
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCancelChanges}
              >
                Скасувати
              </button>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleSaveChanges}
              >
                Зберегти зміни
              </button>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-150px)]">
          {/* Movies list panel */}
          <div className="w-full lg:w-72 bg-gray-800 rounded-lg p-4 flex flex-col shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Список фільмів</h3>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {movies.length} фільмів
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 mb-4">
              <ul className="space-y-2">
                {movies.map(film => (
                  <li 
                    key={film.id} 
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMovie?.id === film.id 
                        ? 'bg-blue-600 border-l-4 border-purple-500' 
                        : 'bg-gray-700 hover:bg-gray-600 border-l-4 border-transparent hover:border-purple-500'
                    }`}
                    onClick={() => handleMovieSelect(film.id)}
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium truncate">{film.title}</div>
                      <div className="text-gray-400 text-sm">{film.year}</div>
                    </div>
                    <button 
                      className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteMovie(film.id);
                      }}
                      title="Видалити фільм"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-1 transition-all hover:-translate-y-0.5"
              onClick={handleAddMovie}
            >
              + Додати новий фільм
            </button>
          </div>

          {/* Movie details panel */}
          <div className="flex-1 bg-gray-800 rounded-lg p-5 overflow-y-auto shadow">
            {localMovie ? (
              <>
                {/* Movie header */}
                <div className="mb-5">
                  <div className="flex items-center gap-5 mb-4">
                    {posterPreview ? (
                      <img 
                        src={posterPreview} 
                        alt="Постер фільму" 
                        className="w-20 h-28 object-cover rounded shadow"
                      />
                    ) : (
                      <div className="w-20 h-28 bg-gray-700 rounded shadow flex items-center justify-center">
                        <span className="text-gray-500">Постер</span>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        type="text"
                        value={localMovie.title}
                        onChange={(e) => handleMovieEdit('title', e.target.value)}
                        className="text-2xl font-bold bg-transparent border-b border-gray-600 focus:border-purple-500 focus:outline-none pb-1"
                        placeholder="Назва фільму"
                      />
                      <input
                        type="text"
                        value={localMovie.eng_title}
                        onChange={(e) => handleMovieEdit('eng_title', e.target.value)}
                        className="text-sm bg-transparent border-b border-gray-600 focus:border-purple-500 focus:outline-none pb-1"
                        placeholder="Англійська назва"
                      />
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                          {localMovie.rating.toFixed(1)} ★
                        </div>
                        <input
                          type="text"
                          value={localMovie.age_rating}
                          onChange={(e) => handleMovieEdit('age_rating', e.target.value)}
                          className="w-16 bg-gray-700 border border-gray-600 rounded-lg p-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                          placeholder="Вік"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form layout */}
                <div className="flex flex-col lg:flex-row gap-5 mb-6">
                  {/* First column - main info */}
                  <div className="flex-1 space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Короткий опис</label>
                      <textarea
                        value={localMovie.short_description}
                        onChange={(e) => handleMovieEdit('short_description', e.target.value)}
                        placeholder="Короткий опис фільму"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Повний опис</label>
                      <textarea
                        value={localMovie.description}
                        onChange={(e) => handleMovieEdit('description', e.target.value)}
                        placeholder="Повний опис фільму"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Рік випуску</label>
                        <input
                          type="number"
                          value={localMovie.year}
                          onChange={(e) => handleMovieEdit('year', parseInt(e.target.value) || 0)}
                          min="1900"
                          max="2100"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Рейтинг (0-10)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            value={localMovie.rating}
                            onChange={(e) => handleMovieEdit('rating', parseFloat(e.target.value))}
                            min="0"
                            max="10"
                            step="0.1"
                            className="flex-1"
                          />
                          <span className="w-10 text-center">{localMovie.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Тривалість</label>
                        <input
                          type="text"
                          value={localMovie.duration}
                          onChange={(e) => handleMovieEdit('duration', e.target.value)}
                          placeholder="1:41"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Тип фільму</label>
                        <input
                          type="text"
                          value={localMovie.movie_type}
                          onChange={(e) => handleMovieEdit('movie_type', e.target.value)}
                          placeholder="Пригодницький фільм"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Дата релізу</label>
                      <input
                        type="date"
                        value={localMovie.release_date}
                        onChange={(e) => handleMovieEdit('release_date', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Прем'єра</label>
                      <input
                        type="date"
                        value={localMovie.premiere}
                        onChange={(e) => handleMovieEdit('premiere', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Кінець показів</label>
                      <input
                        type="text"
                        value={localMovie.end_of_showtime}
                        onChange={(e) => handleMovieEdit('end_of_showtime', e.target.value)}
                        placeholder="1 червня"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Second column - genres, countries, languages, etc. */}
                  <div className="flex-1 space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Жанри (через кому)</label>
                      <input
                        type="text"
                        value={localMovie.genre.join(', ')}
                        onChange={(e) => handleArrayInputChange('genre', e.target.value)}
                        placeholder="Пригоди, Фентезі, Сімейний"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Країни (через кому)</label>
                      <input
                        type="text"
                        value={localMovie.countries.join(', ')}
                        onChange={(e) => handleArrayInputChange('countries', e.target.value)}
                        placeholder="Нова Зеландія, США"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Мови показу (через кому)</label>
                      <input
                        type="text"
                        value={localMovie.display_languages.join(', ')}
                        onChange={(e) => handleArrayInputChange('display_languages', e.target.value)}
                        placeholder="Українська, Англійська"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Субтитри (через кому)</label>
                      <input
                        type="text"
                        value={localMovie.subtitle_languages.join(', ')}
                        onChange={(e) => handleArrayInputChange('subtitle_languages', e.target.value)}
                        placeholder="Англійська"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Бюджет</label>
                      <input
                        type="text"
                        value={localMovie.budget}
                        onChange={(e) => handleMovieEdit('budget', e.target.value)}
                        placeholder="$15 000 000"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Студії (через кому)</label>
                      <input
                        type="text"
                        value={localMovie.studio.join(', ')}
                        onChange={(e) => handleArrayInputChange('studio', e.target.value)}
                        placeholder="CBS Films, Film4"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Дистриб'ютор</label>
                      <input
                        type="text"
                        value={localMovie.distributor}
                        onChange={(e) => handleMovieEdit('distributor', e.target.value)}
                        placeholder="ТОВ \АТ ФІЛМЗ\"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Трейлер (URL)</label>
                      <input
                        type="text"
                        value={localMovie.trailer}
                        onChange={(e) => handleMovieEdit('trailer', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Director section */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Режисер</label>
                      <div className="flex gap-4 mb-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={localMovie.director.name}
                            onChange={(e) => handleDirectorChange('name', e.target.value)}
                            placeholder="Ім'я режисера"
                            className="w-full bg-gray-600 border border-gray-500 rounded p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded cursor-pointer transition-colors">
                            Обрати файл
                            <input
                              type="file"
                              onChange={(e) => handleFileUpload('directorPhoto', e.target.files[0], localMovie.cast[0]?.folder)}
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                          {directorPhotoPreview && (
                            <div className="mt-2">
                              <label className="block text-sm font-medium mb-1">Прев'ю:</label>
                              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-600">
                                <img 
                                  src={getImagePath(localMovie.director.photo, 'directors')}
                                  alt="Режисер" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actors section */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Актори</label>
                      <div className="space-y-3 mb-4">
                        {localMovie.cast.map((actor, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                            <div>
                              <div className="font-medium">{actor.name}</div>
                              <div className="text-gray-400 text-sm">{actor.role}</div>
                              {actor.photo && (
                                <div className="w-10 h-10 rounded-full overflow-hidden mt-2">
                                  <img 
                                    src={getImagePath(actor.photo, actor.folder)} 
                                    alt={actor.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                onClick={() => handleEditActor(index)}
                              >
                                Редагувати
                              </button>
                              <button 
                                className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                                onClick={() => handleDeleteActor(index)}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actor form */}
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium mb-4">{editingActor !== null ? 'Редагувати актора' : 'Додати нового актора'}</h4>
                        <div className="flex flex-col sm:flex-row gap-4 mb-3">
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Ім'я</label>
                            <input
                              type="text"
                              name="name"
                              value={newActor.name}
                              onChange={handleActorInputChange}
                              placeholder="Ім'я актора"
                              className="w-full bg-gray-600 border border-gray-500 rounded p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Роль</label>
                            <input
                              type="text"
                              name="role"
                              value={newActor.role}
                              onChange={handleActorInputChange}
                              placeholder="Роль у фільмі"
                              className="w-full bg-gray-600 border border-gray-500 rounded p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                          <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1">Фото</label>
                              <label className={`block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded cursor-pointer transition-colors ${
                                !newActor.folder && !localMovie.cast?.[0]?.folder ? 'opacity-50 cursor-not-allowed' : ''
                              }`}>
                                Обрати файл
                                <input
                                  type="file"
                                  onChange={(e) => {
                                    if (!newActor.folder && !localMovie.cast?.[0]?.folder) {
                                      alert('Будь ласка, спочатку вкажіть папку для актора');
                                      return;
                                    }
                                    if (e.target.files[0]) {
                                      handleFileUpload('actorPhoto', e.target.files[0], newActor.folder || localMovie.cast?.[0]?.folder);
                                    }
                                  }}
                                  accept="image/*"
                                  className="hidden"
                                  disabled={!newActor.folder && !localMovie.cast?.[0]?.folder}
                                />
                              </label>
                              {actorPhotoPreview && (
                                <div className="mt-2">
                                  <label className="block text-sm font-medium mb-1">Прев'ю:</label>
                                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-600">
                                    <img 
                                      src={actorPhotoPreview} 
                                      alt="Прев'ю актора" 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1">Папка</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  name="folder"
                                  value={newActor.folder || localMovie.cast?.[0]?.folder || ''}
                                  onChange={handleActorInputChange}
                                  placeholder="Назва папки (латиницею)"
                                  className="flex-1 bg-gray-600 border border-gray-500 rounded p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                                  onClick={() => setShowFolderModal(true)}
                                  title="Створити нову папку"
                                >
                                  +
                                </button>
                              </div>
                              {localMovie?.cast?.[0]?.folder && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Поточна папка фільму: {localMovie.cast[0].folder}
                                </p>
                              )}
                            </div>
                          </div>
                        <div className="flex gap-3">
                          {editingActor !== null ? (
                            <>
                              <button 
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                                onClick={handleUpdateActor}
                              >
                                Оновити актора
                              </button>
                              <button 
                                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => {
                                  setEditingActor(null);
                                  setNewActor({ name: '', role: '', photo: '', folder: '' });
                                  setActorPhotoPreview(null);
                                }}
                              >
                                Скасувати
                              </button>
                            </>
                          ) : (
                            <button 
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                              onClick={handleAddActor}
                            >
                              Додати актора
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third column - file uploads and previews */}
                  <div className="flex-1 space-y-5">
                    {/* Banner upload and preview */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Банер фільму</label>
                      <label className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg cursor-pointer transition-colors">
                        Обрати файл
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload('banner', e.target.files[0])}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                      {bannerPreview && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Прев'ю банеру:</label>
                          <div className="bg-gray-700 p-2 rounded-lg">
                            <img 
                              src={bannerPreview} 
                              alt="Прев'ю банеру" 
                              className="w-full h-auto max-h-40 object-contain rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Poster upload and preview */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Постер фільму</label>
                      <label className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg cursor-pointer transition-colors">
                        Обрати файл
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload('poster', e.target.files[0])}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                      {posterPreview && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Прев'ю постера:</label>
                          <div className="bg-gray-700 p-2 rounded-lg">
                            <img 
                              src={posterPreview} 
                              alt="Прев'ю постера" 
                              className="w-full h-auto max-h-40 object-contain rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Folder creation */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Папка для фільму</label>
                      <button
                        type="button"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                        onClick={() => setShowFolderModal(true)}
                      >
                        Створити папку для фільму
                      </button>
                      {localMovie?.cast[0]?.folder && (
                        <div className="mt-2 text-sm text-gray-400">
                          Поточна папка: {localMovie.cast[0].folder}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sessions section */}
                <div className="mt-8">
                  <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-700">
                    <h4 className="font-medium">Сеанси ({localSessions?.length || 0})</h4>
                    <button 
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium flex items-center gap-1 transition-all hover:-translate-y-0.5"
                      onClick={handleAddSession}
                    >
                      + Додати новий сеанс
                    </button>
                  </div>

                  {localSessions.length > 0 ? (
                    <div className="bg-gray-700 rounded-lg overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-800 sticky top-0">
                            <th className="p-3 text-left text-sm font-medium">ID</th>
                            <th className="p-3 text-left text-sm font-medium">Дата</th>
                            <th className="p-3 text-left text-sm font-medium">Час</th>
                            <th className="p-3 text-left text-sm font-medium">Ціна (₴)</th>
                            <th className="p-3 text-left text-sm font-medium">Місця</th>
                            <th className="p-3 text-left text-sm font-medium">Дії</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                          {localSessions.map(session => (
                            <tr key={session.id} className="hover:bg-gray-600">
                              <td className="p-3">{session.id}</td>
                              <td className="p-3">
                                <input
                                  type="date"
                                  value={session.date}
                                  onChange={(e) => handleSessionEdit(session.id, 'date', e.target.value)}
                                  className="bg-gray-600 border border-gray-500 rounded p-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="time"
                                  value={session.time}
                                  onChange={(e) => handleSessionEdit(session.id, 'time', e.target.value)}
                                  className="bg-gray-600 border border-gray-500 rounded p-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              </td>
                              <td className="p-3">
                                <div className="flex items-center">
                                  <span className="mr-1">₴</span>
                                  <input
                                    type="number"
                                    value={session.price}
                                    onChange={(e) => handleSessionEdit(session.id, 'price', parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="5"
                                    className="bg-gray-600 border border-gray-500 rounded p-1 w-20 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={session.available_seats.join(', ')}
                                  onChange={(e) => handleSessionEdit(session.id, 'available_seats', e.target.value.split(',').map(s => s.trim()))}
                                  placeholder="A1, A2, B3"
                                  className="bg-gray-600 border border-gray-500 rounded p-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              </td>
                              <td className="p-3">
                                <button 
                                  className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                                  onClick={() => confirmDeleteSession(session.id)}
                                  title="Видалити сеанс"
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-700 rounded-lg text-gray-400">
                      Немає запланованих сеансів для цього фільму
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
                <div className="text-5xl mb-4">🎬</div>
                <p className="text-xl mb-1">Оберіть фільм для редагування</p>
                <p className="text-gray-600">або натисніть "Додати новий фільм" для створення</p>
              </div>
            )}
          </div>
        </div>

        {/* Folder creation modal */}
        {showFolderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Створення папки для фільму</h3>
              
              {folderCreationStatus ? (
                <div className={`mb-4 p-3 rounded ${folderCreationStatus.includes('успішно') ? 'bg-green-800' : 'bg-red-800'}`}>
                  {folderCreationStatus}
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Назва папки</label>
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Назва фільму (латиницею)"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">Використовуйте лише латинські літери, цифри та дефіси</p>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button 
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setShowFolderModal(false);
                        setNewFolderName('');
                        setFolderCreationStatus('');
                      }}
                    >
                      Скасувати
                    </button>
                    <button 
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      onClick={createMovieFolder}
                      disabled={!newFolderName}
                    >
                      Створити папку
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Підтвердіть видалення</h3>
              <p className="mb-6">
                Ви впевнені, що хочете видалити {movieToDelete ? 'фільм і всі його сеанси' : 'цей сеанс'}?
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Скасувати
                </button>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={movieToDelete ? handleDeleteMovie : handleDeleteSession}
                >
                  Видалити
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success notification popup */}
        {showSuccessPopup && (
          <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
            <div className="bg-purple-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow-lg">
              <span className="font-bold">✓</span>
              {successMessage}
            </div>
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default AdminMovies;