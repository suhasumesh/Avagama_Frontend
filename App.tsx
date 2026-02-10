
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Evaluations from './pages/Evaluations';
import EvaluateProcess from './pages/EvaluateProcess';
import Results from './pages/Results';
import About from './pages/About';
import CEO from './pages/CEO';
import Pricing from './pages/Pricing';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ceo" element={<CEO />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<div className="flex items-center justify-center min-h-[60vh] text-gray-400 font-bold uppercase tracking-widest">Contact Support: support@avagama.ai</div>} />
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/evaluate" element={<EvaluateProcess />} />
            <Route path="/results/:id" element={<Results />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-[#9c66a4]">Avagama</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#9c66a4] to-[#4db6ac]">.AI</span>
                <span className="text-[8px] align-top text-gray-400 ml-0.5">TM</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 font-medium">© 2026 Avagama.ai Powered by Avaali. All Rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
