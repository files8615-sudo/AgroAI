
import React, { useState } from 'react';
import { User } from '../types';
import { Leaf, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface AuthProps {
  onLogin: (user: User, remember: boolean) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin({
        name: name || 'Farmer',
        email: email,
        location: location || 'India'
      }, rememberMe);
    } catch (err) {
      setError("Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col justify-center items-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-agro-600 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-agro-100 p-4 rounded-full mb-4 shadow-inner">
            <Leaf className="w-10 h-10 text-agro-600" />
          </div>
          <h1 className="text-3xl font-bold text-agro-900 tracking-tight">{t('app_title')}</h1>
          <p className="text-earth-800 mt-2 font-medium">{t('smart_farming')}</p>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
          {isLogin ? t('login_welcome') : t('create_account')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <UserIcon className="h-5 w-5 text-gray-400" />
               </div>
               <input
                 type="text"
                 className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-500 outline-none transition-shadow"
                 placeholder={t('full_name')}
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 required
               />
             </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-500 outline-none transition-shadow"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-500 outline-none transition-shadow"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-agro-600 hover:bg-agro-700 disabled:bg-agro-400 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? t('login_to_farm') : t('start_farming'))}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-agro-700 hover:text-agro-800 text-sm font-medium hover:underline transition-colors"
          >
            {isLogin ? t('new_to_app') : t('already_have_account')}
          </button>
        </div>
      </div>
    </div>
  );
};
