import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertOctagon, Loader2, Beaker, Leaf } from 'lucide-react';
import { analyzeCropImage } from '../services/geminiService';
import { DiagnosisResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const CropDoctor: React.FC = () => {
  const { t, language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const diagnosis = await analyzeCropImage(image, language);
      setResult(diagnosis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 h-full pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t('nav_doctor')}</h2>
      </div>

      {!image ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-white hover:border-agro-400 transition-all cursor-pointer h-64 text-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} className="mb-4 text-agro-500 opacity-50" />
          <p className="font-medium text-lg">{t('scan_crop')}</p>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden shadow-md max-h-64 bg-black">
            <img src={image} alt="Crop" className="w-full h-full object-contain mx-auto" />
            <button onClick={reset} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
              <X size={20} />
            </button>
          </div>

          {!result && !loading && (
            <button
              onClick={handleAnalyze}
              className="w-full bg-agro-600 hover:bg-agro-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
            >
              <Leaf size={20} />
              {t('scan_crop')}
            </button>
          )}

          {loading && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <Loader2 className="w-10 h-10 text-agro-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-800 font-medium">{t('analyzing')}</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in space-y-6">
              <div className={`p-6 rounded-xl border-l-4 shadow-sm ${result.isHealthy ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{result.diseaseName}</h3>
                    <p className="text-gray-600 font-medium mt-1">{result.plantName}</p>
                  </div>
                  {result.isHealthy ? <CheckCircle className="text-green-600 w-8 h-8" /> : <AlertOctagon className="text-red-600 w-8 h-8" />}
                </div>
                <p className="mt-4 text-gray-700 text-sm leading-relaxed">{result.description}</p>
              </div>

              {!result.isHealthy && (
                <div className="grid gap-4">
                  <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm">
                    <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                      <Leaf size={18} /> {t('natural_treatment')}
                    </h4>
                    <ul className="space-y-4">
                      {result.naturalTreatments.map((tr, i) => (
                        <li key={i} className="text-sm">
                          <p className="font-semibold text-gray-800">{tr.name}</p>
                          <p className="text-gray-600 mt-0.5">{tr.instruction}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {result.chemicalTreatments.length > 0 && (
                    <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
                      <h4 className="font-bold text-blue-700 mb-4 flex items-center gap-2">
                        <Beaker size={18} /> {t('chemical_treatment')}
                      </h4>
                      <ul className="space-y-4">
                        {result.chemicalTreatments.map((tr, i) => (
                          <li key={i} className="text-sm">
                            <p className="font-semibold text-gray-800">{tr.name}</p>
                            <p className="text-gray-600 mt-0.5">{tr.instruction}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <button onClick={reset} className="w-full py-3 text-agro-700 font-medium hover:bg-agro-50 rounded-lg">
                {t('scan_another')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};