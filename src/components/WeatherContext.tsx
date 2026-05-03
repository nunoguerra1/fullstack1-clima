import { createContext, useReducer, type ReactNode } from 'react';

export type WeatherData = {
    city: string;
    temperature: number;
    windSpeed: number;
    isDay: boolean;
    weatherCode: number;
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

type ContextType = State & { searchWeather: (city: string) => Promise<void> };

export const WeatherContext = createContext<ContextType>({} as ContextType);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(weatherReducer, initialState);

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

            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`);
            if (!weatherRes.ok) throw new Error("Erro de comunicação com o serviço de clima.");

            const weatherData = await weatherRes.json();

            dispatch({
                type: 'FETCH_SUCCESS',
                payload: {
                    city: `${location.name}, ${location.country || ''}`,
                    temperature: weatherData.current_weather.temperature,
                    windSpeed: weatherData.current_weather.windspeed,
                    isDay: weatherData.current_weather.is_day === 1,
                    weatherCode: weatherData.current_weather.weathercode,
                }
            });
        } catch (err: any) {
            dispatch({ type: 'FETCH_ERROR', payload: err.message || "Falha na comunicação com a API." });
        }
    };

    return (
        <WeatherContext.Provider value={{ ...state, searchWeather }}>
            {children}
        </WeatherContext.Provider>
    );
};