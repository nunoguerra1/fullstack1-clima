import { createContext, useReducer, type ReactNode } from 'react';

export type ForecastDay = {
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
};

export type WeatherData = {
    city: string;
    temperature: number;
    windSpeed: number;
    isDay: boolean;
    weatherCode: number;
    forecast: ForecastDay[];
};

type State = {
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
};

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: WeatherData }
    | { type: 'FETCH_ERROR'; payload: string };

const initialState: State = { data: null, loading: false, error: null };

function weatherReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'FETCH_START': return { data: null, loading: true, error: null };
        case 'FETCH_SUCCESS': return { data: action.payload, loading: false, error: null };
        case 'FETCH_ERROR': return { data: null, loading: false, error: action.payload };
        default: return state;
    }
}

type ContextType = State & {
    searchWeather: (city: string) => Promise<void>;
    searchByLocation: (lat: number, lon: number) => Promise<void>;
};

export const WeatherContext = createContext<ContextType>({} as ContextType);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(weatherReducer, initialState);

    const fetchWeatherData = async (lat: number, lon: number, cityName: string) => {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Erro de comunicação com o serviço de clima.");

            const weatherData = await res.json();

            const forecast: ForecastDay[] = [];
            for (let i = 1; i <= 3; i++) {
                forecast.push({
                    date: weatherData.daily.time[i],
                    maxTemp: weatherData.daily.temperature_2m_max[i],
                    minTemp: weatherData.daily.temperature_2m_min[i],
                    weatherCode: weatherData.daily.weathercode[i],
                });
            }

            dispatch({
                type: 'FETCH_SUCCESS',
                payload: {
                    city: cityName,
                    temperature: weatherData.current_weather.temperature,
                    windSpeed: weatherData.current_weather.windspeed,
                    isDay: weatherData.current_weather.is_day === 1,
                    weatherCode: weatherData.current_weather.weathercode,
                    forecast,
                }
            });
        } catch (err: any) {
            dispatch({ type: 'FETCH_ERROR', payload: err.message || "Falha na comunicação." });
        }
    };

    const searchWeather = async (city: string) => {
        const cleanCity = city.trim();
        if (!cleanCity) {
            dispatch({ type: 'FETCH_ERROR', payload: "Ops! Você esqueceu de digitar o nome da cidade." });
            return;
        }

        dispatch({ type: 'FETCH_START' });

        try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cleanCity}&count=1&language=pt`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error("Cidade não encontrada. Verifique a ortografia.");
            }

            const location = geoData.results[0];
            await fetchWeatherData(location.latitude, location.longitude, `${location.name}, ${location.country || ''}`);
        } catch (err: any) {
            dispatch({ type: 'FETCH_ERROR', payload: err.message });
        }
    };

    const searchByLocation = async (lat: number, lon: number) => {
        dispatch({ type: 'FETCH_START' });
        try {
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`);
            const geoData = await geoRes.json();
            const cityName = geoData.city || geoData.locality || "Sua Localização";

            await fetchWeatherData(lat, lon, cityName);
        } catch (err: any) {
            dispatch({ type: 'FETCH_ERROR', payload: "Não foi possível identificar sua localização." });
        }
    };

    return (
        <WeatherContext.Provider value={{ ...state, searchWeather, searchByLocation }}>
            {children}
        </WeatherContext.Provider>
    );
};