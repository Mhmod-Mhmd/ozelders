import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { SUBJECTS } from '@/data';
import { paths } from '@/router/paths';

const LANGUAGES = [
  'Any language',
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Japanese',
  'Mandarin',
];

export function SearchBar() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');

  function handleSearch() {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (language && language !== 'Any language') params.set('q', language);
    const query = params.toString();
    navigate(query ? `${paths.tutors}?${query}` : paths.tutors);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-gray-100 sm:flex-row sm:items-center">
      <div className="flex-1">
        <label className="sr-only" htmlFor="search-subject">
          Subject
        </label>
        <Select
          id="search-subject"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-transparent hover:border-gray-200"
        >
          <option value="">What do you want to learn?</option>
          {SUBJECTS.map((subject) => (
            <option key={subject.key} value={subject.key}>
              {subject.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="hidden w-px self-stretch bg-gray-100 sm:block" />

      <div className="flex-1">
        <label className="sr-only" htmlFor="search-language">
          Language
        </label>
        <Select
          id="search-language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border-transparent hover:border-gray-200"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </Select>
      </div>

      <Button size="lg" onClick={handleSearch} className="sm:w-auto">
        <Search className="h-5 w-5" />
        Search
      </Button>
    </div>
  );
}
