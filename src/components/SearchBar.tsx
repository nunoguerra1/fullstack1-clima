import { useState, useContext } from 'react';
import { MagnifyingGlass, WarningCircle, NavigationArrow } from '@phosphor-icons/react';
import { WeatherContext } from '../contexts/WeatherContext';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const { searchWeather, searchByLocation, loading, error } = useContext(WeatherContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        searchWeather(query);
    };

    const handleLocationClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    searchByLocation(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    alert("Por favor, permita o acesso à sua localização no navegador.");
                }
            );
        } else {
            alert("Seu navegador não suporta geolocalização.");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-20 px-4 flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center mb-8 text-[#111827] z-10">
                Como está o <br /> <span className="text-[#84cc16]">clima hoje?</span>
            </h1>

            <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-4 relative z-10">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400">
                        <MagnifyingGlass size={24} weight="bold" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Digite uma cidade..."
                        className="w-full bg-white/80 backdrop-blur-md rounded-full pl-16 pr-8 py-5 text-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-transparent focus:border-[#84cc16] transition-colors"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleLocationClick}
                    disabled={loading}
                    title="Usar minha localização"
                    className="bg-white/80 backdrop-blur-md text-[#111827] rounded-full p-5 shadow-sm border-2 border-transparent hover:border-[#84cc16] transition-all disabled:opacity-50 flex items-center justify-center"
                >
                    <NavigationArrow size={28} weight="fill" />
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#111827] text-white rounded-full px-10 py-5 text-xl font-bold hover:bg-[#374151] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    {loading ? 'Buscando' : 'Descobrir'}
                </button>
            </form>

            {error && (
                <div className="mt-6 bg-[#fee2e2] text-[#991b1b] px-6 py-4 rounded-full font-medium text-lg flex items-center gap-3 z-10">
                    <WarningCircle size={24} weight="fill" />
                    {error}
                </div>
            )}
        </div>
    );
}