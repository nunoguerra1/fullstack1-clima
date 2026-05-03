import { useContext } from 'react';
import { motion } from 'framer-motion';
import { WeatherContext } from '../contexts/WeatherContext';

export function AnimatedBackground() {
    const { data } = useContext(WeatherContext);

    let color1 = "bg-green-300";
    let color2 = "bg-blue-300";

    if (data) {
        if (data.weatherCode >= 51 && data.weatherCode <= 67) {
            color1 = "bg-gray-400"; color2 = "bg-blue-500";
        } else if (data.weatherCode >= 1 && data.weatherCode <= 3) {
            color1 = "bg-gray-300"; color2 = "bg-gray-400";
        } else if (!data.isDay) {
            color1 = "bg-indigo-900"; color2 = "bg-purple-900";
        } else {
            color1 = "bg-yellow-300"; color2 = "bg-orange-300";
        }
    }

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f3f4f6] transition-colors duration-1000">
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -100, 50, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-3xl opacity-50 ${color1} transition-colors duration-1000`}
            />
            <motion.div
                animate={{
                    x: [0, -100, 50, 0],
                    y: [0, 100, -50, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-3xl opacity-50 ${color2} transition-colors duration-1000`}
            />
        </div>
    );
}