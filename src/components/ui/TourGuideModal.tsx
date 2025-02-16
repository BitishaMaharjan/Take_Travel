import React, { useState } from 'react';
import { X, Plus, X as XIcon } from 'lucide-react';
import axios from 'axios';

interface TourGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  experience: string;
  role:string
  languages: string[];
  specialization: string;
  password: string;
  passwordConfirm: string;
}

type Specialization = 'cultural' | 'adventure' | 'historical' | 'nature' | 'food';

const TourGuideModal: React.FC<TourGuideModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    experience: '',
    role:'guide',
    languages: [],
    specialization: '',
    password: '',
    passwordConfirm: ''
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const availableLanguages: string[] = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Chinese',
    'Japanese',
    'Arabic',
    'Russian',
    'Portuguese',
    'Hindi',
    'Korean',
    'Thai',
    'Vietnamese',
    'Turkish'
  ].sort();

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:8000/users/signup/guide',formData)
      console.log(response.data)
    }catch(err){
      console.log(err)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addLanguage = (): void => {
    if (selectedLanguage && !formData.languages.includes(selectedLanguage)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, selectedLanguage]
      }));
      setSelectedLanguage('');
    }
  };

  const removeLanguage = (languageToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== languageToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          type="button"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-orange-600">Tour Guide Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <input
                id="experience"
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Years of experience"
              />
            </div>
          </div>

          <div>
            <label htmlFor="languageSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Languages
            </label>
            <div className="flex gap-2 mb-2">
              <select
                id="languageSelect"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select a language</option>
                {availableLanguages
                  .filter(lang => !formData.languages.includes(lang))
                  .map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))
                }
              </select>
              <button
                type="button"
                onClick={addLanguage}
                className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Add language"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map(lang => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="text-orange-600 hover:text-orange-800"
                    aria-label={`Remove ${lang}`}
                  >
                    <XIcon size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <select
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select specialization</option>
              <option value="cultural">Cultural Tours</option>
              <option value="adventure">Adventure Tours</option>
              <option value="historical">Historical Tours</option>
              <option value="nature">Nature Tours</option>
              <option value="food">Food Tours</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default TourGuideModal;