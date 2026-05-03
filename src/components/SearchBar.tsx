import { useState, useContext } from 'react';
import { MagnifyingGlass, WarningCircle } from '@phosphor-icons/react';
import { WeatherContext } from '../contexts/WeatherContext';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const { searchWeather, loading, error } = useContext(WeatherContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        searchWeather(query);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-20 px-4 flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center mb-8 text-[#111827]">
                Como está o <br /> <span className="text-[#84cc16]">clima hoje?</span>
            </h1>

            <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-4 relative">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400">
                        <MagnifyingGlass size={24} weight="bold" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Digite uma cidade..."
                        className="w-full bg-white rounded-full pl-16 pr-8 py-5 text-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-transparent focus:border-[#84cc16] transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#111827] text-white rounded-full px-10 py-5 text-xl font-bold hover:bg-[#374151] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    {loading ? 'Buscando' : 'Descobrir'}
                </button>
            </form>

            {error && (
                <div className="mt-6 bg-[#fee2e2] text-[#991b1b] px-6 py-4 rounded-full font-medium text-lg flex items-center gap-3">
                    <WarningCircle size={24} weight="fill" />
                    {error}
                </div>
            )}
        </div>
    );
}