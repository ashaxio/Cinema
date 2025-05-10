import React, { useEffect, useState, useContext } from 'react';
import Navbar from "../components/navbar";
import StatsCard from "../components/StatsCard";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FilmDataContext } from '../FilmDataProvider';

const generateStatsData = () => ({
  movies: {
    value: Math.floor(2000 + Math.random() * 500).toLocaleString(),
    trend: (Math.random() * 20 - 5).toFixed(1) + '%',
    trendUp: Math.random() > 0.3,
  },
  users: {
    value: Math.floor(18000 + Math.random() * 1000).toLocaleString(),
    trend: (Math.random() * 30 - 5).toFixed(1) + '%',
    trendUp: Math.random() > 0.2,
  },
  reviews: {
    value: Math.floor(500 + Math.random() * 200).toString(),
    trend: (Math.random() * 15 - 3).toFixed(1) + '%',
    trendUp: Math.random() > 0.4,
  },
  watchTime: {
    value: (2 + Math.random() * 0.8).toFixed(1) + 'M hrs',
    trend: (Math.random() * 10 - 5).toFixed(1) + '%',
    trendUp: Math.random() > 0.5,
  }
});

const generateGenreData = () => [
  { name: 'Розважальне', percentage: Math.floor(75 + Math.random() * 20) },
  { name: 'Фентезі', percentage: Math.floor(65 + Math.random() * 20) },
  { name: 'Екшн', percentage: Math.floor(55 + Math.random() * 20) },
  { name: 'Драматичне', percentage: Math.floor(45 + Math.random() * 20) },
  { name: 'Жахи', percentage: Math.floor(35 + Math.random() * 20) },
];

const generateChartData = (timeframe) => {
  if (timeframe === 'week') {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    return days.map(day => ({
      name: day,
      Розважальне: Math.floor(50 + Math.random() * 40),
      Фентезі: Math.floor(30 + Math.random() * 50),
      Екшн: Math.floor(35 + Math.random() * 40),
    }));
  } else if (timeframe === 'month') {
    const weeks = ['Тиж 1', 'Тиж 2', 'Тиж 3', 'Тиж 4', 'Тиж 5'];
    return weeks.map(week => ({
      name: week,
      Розважальне: Math.floor(200 + Math.random() * 150),
      Фентезі: Math.floor(150 + Math.random() * 180),
      Екшн: Math.floor(180 + Math.random() * 160),
    }));
  } else if (timeframe === 'quarter') {
    const months = ['Бер', 'Квіт', 'Трав', 'Черв', 'Лип', 'Серп', 'Вер', 'Жовт', 'Лист', 'Груд', 'Січ', 'Лют'].slice(-3);
    return months.map(month => ({
      name: month,
      Розважальне: Math.floor(600 + Math.random() * 400),
      Фентезі: Math.floor(500 + Math.random() * 450),
      Екшн: Math.floor(550 + Math.random() * 420),
    }));
  }

  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  return days.map(day => ({
    name: day,
    Розважальне: Math.floor(50 + Math.random() * 40),
    Фентезі: Math.floor(30 + Math.random() * 50),
    Екшн: Math.floor(35 + Math.random() * 40),
  }));
};

const generateEngagementMetrics = () => [
  { name: 'Середній рейтинг', value: (3 + Math.random() * 2).toFixed(1) + '/5' },
  { name: 'Середній час перегляду', value: Math.floor(70 + Math.random() * 30) + ' хв' },
  { name: 'Частота повернень', value: Math.floor(3 + Math.random() * 4) + ' x тиждень' }
];

const generateGeographicData = () => [
  { name: 'Україна', value: Math.floor(40 + Math.random() * 20) },
  { name: 'США', value: Math.floor(15 + Math.random() * 10) },
  { name: 'Польща', value: Math.floor(10 + Math.random() * 8) },
  { name: 'Німеччина', value: Math.floor(8 + Math.random() * 7) },
  { name: 'Інші', value: Math.floor(10 + Math.random() * 15) }
];

const Icons = {
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>
  ),
  Film: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
    </svg>
  ),
  Calendar: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    </svg>
  ),
  Play: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  ),
  Star: () => (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
  ),
  Globe: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  ),
  Chart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>
  ),
  Review: () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
  </svg>
),
};

const COLORS = ['#3b82f6', '#ea580c', '#a855f7', '#10b981', '#ef4444'];

function AdminDashboard() {
  const { films, loading } = useContext(FilmDataContext);
  const [statsData, setStatsData] = useState(generateStatsData());
  const [genreData, setGenreData] = useState(generateGenreData());
  const [timeframeOption, setTimeframeOption] = useState('week');
  const [chartData, setChartData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  
  const [recentFilms, setRecentFilms] = useState([]);
  const [engagementMetrics, setEngagementMetrics] = useState(generateEngagementMetrics());
  const [geographicData, setGeographicData] = useState(generateGeographicData());

  useEffect(() => {
    const initialData = generateChartData('week');
    setChartData(initialData);
  }, []);

  useEffect(() => {
    console.log(`Timeframe changed to: ${timeframeOption}`);
    const newData = generateChartData(timeframeOption);
    console.log('New chart data:', newData);
    setChartData(newData);
  }, [timeframeOption]);

  const getRecentFilms = () => {
    if (!loading && films && films.length > 0) {
      const sortedFilms = [...films].sort((a, b) => {
        if (a.addedDate && b.addedDate) {
          return new Date(b.addedDate) - new Date(a.addedDate);
        }
        return b.id - a.id;
      });
      
      const recent = sortedFilms.slice(0, 5).map(film => ({
        id: film.id || Math.floor(1000 + Math.random() * 9000),
        title: film.title || film.name || 'Untitled Film',
        added: film.addedDate ? new Date(film.addedDate).toLocaleDateString() : new Date().toLocaleDateString(),
        views: film.views || Math.floor(100 + Math.random() * 2000),
        rating: film.rating || (2.5 + Math.random() * 2.5).toFixed(1)
      }));
      
      return recent;
    }
    return [];
  };

  const updateMoviesCount = () => {
    if (!loading && films && films.length > 0) {
      const updatedStats = {
        ...statsData,
        movies: {
          value: films.length.toLocaleString(),
          trend: statsData.movies.trend,
          trendUp: statsData.movies.trendUp
        }
      };
      setStatsData(updatedStats);
    }
  };

  useEffect(() => {
    if (!loading && films && films.length > 0) {
      updateMoviesCount();
      setRecentFilms(getRecentFilms());
    }
  }, [films, loading]);

  const refreshDashboard = () => {
    setStatsData(prev => ({
      ...generateStatsData(),
      movies: {
        value: !loading && films && films.length > 0 ? films.length.toLocaleString() : prev.movies.value,
        trend: (Math.random() * 20 - 5).toFixed(1) + '%',
        trendUp: Math.random() > 0.3,
      }
    }));
    setGenreData(generateGenreData());
    
    setChartData(generateChartData(timeframeOption));
    
    setLastUpdated(new Date());
    
    setRecentFilms(getRecentFilms());
    
    setEngagementMetrics(generateEngagementMetrics());
    setGeographicData(generateGeographicData());
  };

  useEffect(() => {
    let intervalId;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        refreshDashboard();
      }, refreshInterval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshInterval, autoRefresh, films, timeframeOption]); // Added timeframeOption as dependency

  const handleTimeframeChange = (e) => {
    const newTimeframe = e.target.value;
    console.log(`Changing timeframe to: ${newTimeframe}`);
    setTimeframeOption(newTimeframe);
  };

  if (loading) {
    return (
      <Navbar>
        <div className="bg-black-100 p-6 min-h-screen">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-white-600">Загрузка данних...</div>
          </div>
        </div>
      </Navbar>
    );
  }

  return (
    <Navbar>
     <div className="bg-black-100 p-6 min-h-screen">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#0f1827] p-4 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold text-white-900">Admin Dashboard</h1>
            <p className="mt-1 text-white-600">
              З поверненням до адмін-панелі!
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-2">
            <div className="flex items-center text-white-500 text-bold gap-1">
              <Icons.Clock />
              <span>Останнє оновлення: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={refreshDashboard}
                className="inline-flex items-center px-3 py-1.5 bg-black-600 text-white rounded-md hover:bg-blue-700 transition-colors text-bold gap-1"
              >
                <Icons.Refresh />
                Оновити
              </button>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={() => setAutoRefresh(!autoRefresh)}
                  className="rounded"
                />
                <label htmlFor="autoRefresh" className="text-bold text-white-900">
                  Авто-оновлення
                </label>
              </div>
              
              {autoRefresh && (
                <select 
                  value={refreshInterval} 
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="text-bold border-gray-300 rounded-md"
                >
                  <option value={5000}>Кожні 5сек</option>
                  <option value={10000}>Кожні 10сек</option>
                  <option value={30000}>Кожні 30сек</option>
                </select>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Фільми" 
            value={statsData.movies.value} 
            icon={<Icons.Film />} 
            color="blue"
          />
          <StatsCard 
            title="Користувачі" 
            value={statsData.users.value} 
            icon={<Icons.Users />} 
            color="green" 
          />
          <StatsCard 
            title="Відгуки" 
            value={statsData.reviews.value} 
            icon={<Icons.Review />} 
            color="purple" 
          />
          <StatsCard 
            title="Час перегляду" 
            value={statsData.watchTime.value} 
            icon={<Icons.Play />} 
            color="amber" 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#0f1827] rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white-900">Графік переглядів</h2>
              <select 
                className="text-sm border-gray-300 rounded-md"
                value={timeframeOption}
                onChange={handleTimeframeChange}
              >
                <option value="week">Останні 7 днів</option>
                <option value="month">Останні 30 днів</option>
                <option value="quarter">Останні 3 місяці</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Розважальне" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Фентезі" stroke="#ea580c" />
                  <Line type="monotone" dataKey="Екшн" stroke="#a855f7" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-[#0f1827] rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-white-900 mb-4">Топ жанрів</h2>
            <div className="space-y-4">
              {genreData.map((genre) => (
                <div key={genre.name} className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-white-700">{genre.name}</span>
                      <span className="text-sm font-medium text-white-700">{genre.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${genre.percentage}%`,
                          backgroundColor: genre.name === 'Розважальне' ? '#3b82f6' :
                                          genre.name === 'Фентезі' ? '#ea580c' :
                                          genre.name === 'Екшн' ? '#a855f7' :
                                          genre.name === 'Драматичне' ? '#10b981' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0f1827] rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white-900">Нещодавно додані фільми</h2>
            <button className="text-sm text-blue-500 hover:text-blue-700">
              Переглянути всі
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Назва</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Додано</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Перегляди</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Рейтинг</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentFilms.length > 0 ? (
                  recentFilms.map((film) => (
                    <tr key={film.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{film.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{film.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{film.added}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{film.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-1">{film.rating}</span>
                          <Icons.Star />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      Немає доступних фільмів або дані завантажуються
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0f1827] rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Icons.Chart className="text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-white-900">Метрики залучення користувачів</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {engagementMetrics.map((metric, index) => (
                <div key={index} className="bg-[#0d141e] p-4 rounded-lg">
                  <p className="text-sm text-gray-400">{metric.name}</p>
                  <p className="text-2xl font-bold text-white-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1827] rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Icons.Globe className="text-green-500 mr-2" />
              <h2 className="text-lg font-semibold text-white-900">Географічний розподіл користувачів</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={geographicData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {geographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {geographicData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs text-white-700">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1827] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white-900 mb-4">Перегляди за пристроями</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Desktop', value: Math.floor(40 + Math.random() * 20) },
                  { name: 'Mobile', value: Math.floor(30 + Math.random() * 20) },
                  { name: 'Tablet', value: Math.floor(15 + Math.random() * 10) },
                  { name: 'Smart TV', value: Math.floor(10 + Math.random() * 10) },
                  { name: 'Other', value: Math.floor(1 + Math.random() * 5) }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}
export default AdminDashboard;