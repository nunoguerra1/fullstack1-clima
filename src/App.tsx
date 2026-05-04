import { WeatherProvider } from './contexts/WeatherContext';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { AnimatedBackground } from './components/AnimatedBackground';

function App() {
  return (
    <WeatherProvider>
      <AnimatedBackground />
      <main className="w-full min-h-screen pb-20 relative">
        <SearchBar />
        <WeatherCard />
      </main>
    </WeatherProvider>
  );
}

export default App;