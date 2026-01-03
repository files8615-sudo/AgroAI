
import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ExpertSupport: React.FC = () => {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    // In a real app, this would POST to a backend
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="bg-agro-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquare /> {t('ask_expert')}
        </h2>
        <p className="text-agro-100 mt-2">
          {t('expert_desc')}
        </p>
      </div>

      {sent ? (
        <div className="bg-green-50 text-green-800 p-8 rounded-xl text-center border border-green-200 animate-fade-in">
          <h3 className="text-xl font-bold mb-2">{t('request_sent')}</h3>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('subject_label')}</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-agro-500 bg-white">
              <option>Disease Identification Help</option>
              <option>Fertilizer Recommendation</option>
              <option>Irrigation Advice</option>
              <option>General Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('description_label')}</label>
            <textarea 
              required
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-agro-500 h-32 resize-none"
              placeholder="..."
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full bg-earth-800 hover:bg-earth-900 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <Send size={18} /> {t('submit_request')}
          </button>
        </form>
      )}

      <div className="text-center text-sm text-gray-400 mt-8">
        <p>{t('app_title')} &copy; 2025</p>
      </div>
    </div>
  );
};
