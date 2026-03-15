import { useState, useEffect } from 'react';

const WEATHER_ICONS = {
    Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️',
    Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️',
    Haze: '🌫️', Smoke: '🌫️', Dust: '🌪️', Sand: '🌪️',
};

const WeatherWidget = ({ city, country }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

    useEffect(() => {
        if (!city) return;
        const fetchWeather = async () => {
            setLoading(true);
            setError(false);
            try {
                if (!API_KEY || API_KEY === 'your_openweather_api_key_here') {
                    // Show mock data when no key provided
                    setWeather({
                        temp: 28, feels_like: 31, humidity: 72, wind: 14,
                        description: 'Partly cloudy', main: 'Clouds',
                        city, country, mock: true,
                    });
                    return;
                }
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${encodeURIComponent(country || '')}&appid=${API_KEY}&units=metric`
                );
                if (!res.ok) throw new Error('Weather not found');
                const d = await res.json();
                setWeather({
                    temp: Math.round(d.main.temp),
                    feels_like: Math.round(d.main.feels_like),
                    humidity: d.main.humidity,
                    wind: Math.round(d.wind.speed * 3.6), // m/s → km/h
                    description: d.weather[0].description,
                    main: d.weather[0].main,
                    city: d.name,
                    country: d.sys.country,
                    mock: false,
                });
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [city, country, API_KEY]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-100 p-5 bg-gradient-to-br from-sky-50 to-blue-50">
                <div className="animate-pulse flex gap-4">
                    <div className="skeleton w-14 h-14 rounded-full" />
                    <div className="flex-1 space-y-2 pt-1">
                        <div className="skeleton h-4 w-1/2 rounded" />
                        <div className="skeleton h-6 w-1/3 rounded" />
                        <div className="skeleton h-3 w-2/3 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50 text-center text-sm text-gray-400">
                <span className="text-2xl">🌍</span>
                <p className="mt-1">Weather data unavailable</p>
            </div>
        );
    }

    const icon = WEATHER_ICONS[weather.main] || '🌡️';
    const tempColor = weather.temp > 35 ? '#ef4444' : weather.temp > 20 ? '#f97316' : weather.temp > 10 ? '#3b82f6' : '#6366f1';

    return (
        <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #e0e7ff 100%)' }}
        >
            {/* Background decoration */}
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20" style={{ background: tempColor }} />
            <div className="absolute -right-2 -bottom-4 w-16 h-16 rounded-full opacity-10" style={{ background: tempColor }} />

            {weather.mock && (
                <div className="absolute top-3 right-3 text-[10px] font-medium bg-white/60 text-gray-500 px-2 py-0.5 rounded-full">
                    Demo
                </div>
            )}

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                            📍 {weather.city}{weather.country ? `, ${weather.country}` : ''}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">{weather.description}</p>
                    </div>
                    <span className="text-4xl">{icon}</span>
                </div>

                <div className="flex items-end gap-3 mb-4">
                    <span className="text-5xl font-extrabold" style={{ color: tempColor }}>
                        {weather.temp}°
                    </span>
                    <div className="mb-1.5">
                        <p className="text-xs text-gray-500">Feels like {weather.feels_like}°C</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 rounded-xl px-3 py-2">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Humidity</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">💧 {weather.humidity}%</p>
                    </div>
                    <div className="bg-white/60 rounded-xl px-3 py-2">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Wind</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">💨 {weather.wind} km/h</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
