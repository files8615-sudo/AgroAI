import React from 'react';
import { User, WeatherData, AppView } from '../types';
import { CloudRain, Sun, Wind, Droplets, AlertTriangle, Camera, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DashboardProps {
  user: User;
  weather: WeatherData;
  onChangeView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, weather, onChangeView }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('hello')}, {user.name.split(' ')[0]}</h2>
          <p className="text-gray-500 text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-agro-500 to-agro-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 opacity-10 -mr-4 -mt-4">
          <Sun size={120} style={{ animation: 'spin 20s linear infinite' }} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-agro-100 font-medium">{t('weather_current')}</p>
              <h3 className="text-4xl font-bold mt-1">{weather.temp}°C</h3>
              <p className="text-agro-50">{weather.condition}</p>
            </div>
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
              {weather.condition.toLowerCase().includes('rain') ? <CloudRain size={32} /> : <Sun size={32} />}
            </div>
          </div>
          
          <div className="flex gap-6 mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Droplets size={18} className="text-agro-200" />
              <span className="text-sm font-medium">{weather.humidity}% {t('humidity')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind size={18} className="text-agro-200" />
              <span className="text-sm font-medium">{weather.windSpeed} km/h {t('wind')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onChangeView(AppView.DIAGNOSIS)}
          className="bg-white p-6 rounded-xl shadow-sm border border-agro-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow group"
        >
          <div className="bg-agro-50 p-4 rounded-full group-hover:bg-agro-100 transition-colors">
            <Camera className="text-agro-600 w-8 h-8" />
          </div>
          <span className="font-semibold text-gray-800">{t('scan_crop')}</span>
        </button>

        <button 
          onClick={() => onChangeView(AppView.NOTES)}
          className="bg-white p-6 rounded-xl shadow-sm border border-agro-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow group"
        >
          <div className="bg-earth-100 p-4 rounded-full group-hover:bg-earth-200 transition-colors">
            <FileText className="text-earth-800 w-8 h-8" />
          </div>
          <span className="font-semibold text-gray-800">{t('field_notes')}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{t('recent_alerts')}</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="p-4 flex gap-3">
            <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={20} />
            <div>
              <p className="font-medium text-gray-800 text-sm">Potential Potato Blight</p>
              <p className="text-xs text-gray-500 mt-1">High humidity forecasted next 48h.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};