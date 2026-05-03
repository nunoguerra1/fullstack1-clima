import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudRain, Cloud, Wind, Moon } from '@phosphor-icons/react';
import { WeatherContext } from '../contexts/WeatherContext';

export function WeatherCard() {
    const { data } = useContext(WeatherContext);

    if (!data) return null;

    let bgColor = "bg-[#fcd34d]";
    let weatherText = "Ensolarado / Limpo";
    let Icon = data.isDay ? Sun : Moon;

    if (data.weatherCode >= 51 && data.weatherCode <= 67) {
        bgColor = "bg-[#93c5fd]";
        weatherText = "Chuvoso";
        Icon = CloudRain;
    } else if (data.weatherCode >= 1 && data.weatherCode <= 3) {
        bgColor = "bg-[#d1d5db]";
        weatherText = "Nublado";
        Icon = Cloud;
    } else if (!data.isDay) {
        bgColor = "bg-[#374151]";
        weatherText = "Noite Estrelada";
    }

    const textColor = bgColor === "bg-[#374151]" ? "text-white" : "text-[#111827]";

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className={`w-full max-w-md mx-auto mt-12 p-10 rounded-[3rem] ${bgColor} shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col items-center ${textColor} transition-colors duration-500`}
        >
            <div className="mb-6">
                <Icon size={100} weight="duotone" />
            </div>

            <h2 className="text-3xl font-bold text-center mb-1">{data.city}</h2>
            <p className="text-lg font-medium opacity-70 uppercase tracking-widest mb-8 text-center">{weatherText}</p>

            <div className="text-8xl font-black tracking-tighter mb-10 flex items-start">
                {Math.round(data.temperature)}
                <span className="text-4xl mt-2">°C</span>
            </div>

            <div className="w-full bg-white/20 rounded-[2rem] p-6 flex justify-between items-center backdrop-blur-md">
                <div className="flex flex-col items-center gap-1">
                    <Wind size={24} weight="bold" className="opacity-60" />
                    <span className="text-sm font-bold uppercase tracking-wider opacity-60">Vento</span>
                    <span className="text-xl font-black">{data.windSpeed} km/h</span>
                </div>
                <div className="h-12 w-1 bg-current opacity-10 rounded-full"></div>
                <div className="flex flex-col items-center gap-1">
                    {data.isDay ? <Sun size={24} weight="bold" className="opacity-60" /> : <Moon size={24} weight="bold" className="opacity-60" />}
                    <span className="text-sm font-bold uppercase tracking-wider opacity-60">Período</span>
                    <span className="text-xl font-black">{data.isDay ? 'Dia' : 'Noite'}</span>
                </div>
            </div>
        </motion.div>
    );
}