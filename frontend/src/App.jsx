import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Templates from './pages/Templates';
import GenerateOffer from './pages/GenerateOffer';
import OfferHistory from './pages/OfferHistory';
import VerifyOffer from './pages/VerifyOffer';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <Routes>
      <Route path="/" element={<Landing darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
      <Route element={<Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/generate" element={<GenerateOffer />} />
        <Route path="/history" element={<OfferHistory />} />
        <Route path="/verify" element={<VerifyOffer />} />
      </Route>
    </Routes>
  );
}

export default App;
