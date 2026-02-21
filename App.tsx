
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Evaluations from './pages/Evaluations';
import EvaluateProcess from './pages/EvaluateProcess';
import Results from './pages/Results';
import Compare from './pages/Compare';
import Prism from './pages/Prism';
import About from './pages/About';
import CEO from './pages/CEO';
import Pricing from './pages/Pricing';
import CompanyDiscovery from './pages/Discovery/CompanyDiscovery';
import DomainDiscovery from './pages/Discovery/DomainDiscovery';
import DiscoveryDetail from './pages/Discovery/DiscoveryDetail';
import AdminPanel from './pages/Admin/AdminPanel';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Authenticated Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/evaluate" element={<EvaluateProcess />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/prism" element={<Prism />} />
            
            {/* New Discovery Routes */}
            <Route path="/discovery/company" element={<CompanyDiscovery />} />
            <Route path="/discovery/domain" element={<DomainDiscovery />} />
            <Route path="/discovery/detail/:id" element={<DiscoveryDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-[#a26da8]">Avagama</span>
                <span className="bg-gradient-to-r from-[#a26da8] via-[#a26da8] to-[#6fcbbd] bg-clip-text text-transparent ml-[1px]">.AI</span>
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
