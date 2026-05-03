import { WeatherProvider } from './contexts/WeatherContext';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';

function App() {
  return (
    <WeatherProvider>
      <main className="w-full min-h-screen pb-20">
        <SearchBar />
        <WeatherCard />
      </main>
    </WeatherProvider>
  );
}

export default App;