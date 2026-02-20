
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavigationProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [initial, setInitial] = useState('U');
  const [showDiscoveryMenu, setShowDiscoveryMenu] = useState(false);
  const dropdownTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.firstName) {
            setInitial(user.firstName.charAt(0).toUpperCase());
          }
        } catch (e) {
          console.error("Failed to parse user data");
        }
      }
    }
    return () => {
      if (dropdownTimeoutRef.current) {
        window.clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/');
  };

  const openDropdown = () => {
    if (dropdownTimeoutRef.current) {
      window.clearTimeout(dropdownTimeoutRef.current);
    }
    setShowDiscoveryMenu(true);
  };

  const closeDropdown = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setShowDiscoveryMenu(false);
    }, 400); // 400ms delay to give user time to move mouse into the menu
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const Logo = () => (
    <div className="flex items-center">
      <span className="text-3xl font-semibold tracking-tight inline-flex items-start">
        <span className="text-[#a26da8]">Avagama</span>
        <span className="bg-gradient-to-r from-[#a26da8] via-[#a26da8] to-[#6fcbbd] bg-clip-text text-transparent ml-[1px]">
          .AI
        </span>
        <span className="text-[10px] font-medium text-gray-400 ml-[1px] -mt-1">TM</span>
      </span>
    </div>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 px-10 py-5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-16">
        <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        {!isAuthPage && !isAuthenticated && (
          <div className="hidden md:flex items-center gap-10">
            <Link to="/about" className="text-sm font-bold tracking-wide text-gray-500 hover:text-gray-900 transition-colors uppercase">About</Link>
            <Link to="/ceo" className="text-sm font-bold tracking-wide text-gray-500 hover:text-gray-900 transition-colors uppercase">CEO</Link>
            <Link to="/pricing" className="text-sm font-bold tracking-wide text-gray-500 hover:text-gray-900 transition-colors uppercase">Pricing</Link>
            <Link to="/contact" className="text-sm font-bold tracking-wide text-gray-500 hover:text-gray-900 transition-colors uppercase">Contact Us</Link>
          </div>
        )}

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-10">
            <Link to="/dashboard" className={`text-sm font-bold tracking-wide transition-colors ${location.pathname === '/dashboard' ? 'text-[#a26da8]' : 'text-gray-500 hover:text-gray-900'}`}>DASHBOARD</Link>
            
            {/* Discovery Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button className={`text-sm font-bold tracking-wide flex items-center gap-1 transition-colors ${location.pathname.includes('/discovery') ? 'text-[#a26da8]' : 'text-gray-500 hover:text-gray-900'}`}>
                AI DISCOVERY
                <svg className={`w-4 h-4 transition-transform duration-300 ${showDiscoveryMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              
              {showDiscoveryMenu && (
                <div className="absolute top-full left-0 mt-0 pt-2 w-56 bg-transparent z-[60]">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 overflow-hidden animate-fadeIn">
                    <Link 
                      to="/discovery/company" 
                      className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-gray-600 hover:bg-purple-50 hover:text-[#a26da8] transition-all"
                      onClick={() => setShowDiscoveryMenu(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#a26da8]"></span>
                      By Company Analysis
                    </Link>
                    <Link 
                      to="/discovery/domain" 
                      className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-[#4db6ac] transition-all"
                      onClick={() => setShowDiscoveryMenu(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#4db6ac]"></span>
                      By Industry Domain
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/evaluations" className={`text-sm font-bold tracking-wide transition-colors ${location.pathname === '/evaluations' ? 'text-[#a26da8]' : 'text-gray-500 hover:text-gray-900'}`}>MY EVALUATIONS</Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {isAuthPage ? (
          <button 
            onClick={() => navigate('/contact')}
            className="flex items-center gap-2 text-[#a26da8] font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Help & Support
          </button>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-5 pl-6 border-l border-gray-100">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#a26da8] to-[#6fcbbd] flex items-center justify-center text-white font-black shadow-lg">
              {initial}
            </div>
            <button onClick={handleLogout} className="p-2.5 text-gray-400 hover:text-red-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 px-4 py-2">LOG IN</Link>
            <Link to="/register" className="bg-gray-900 text-white px-7 py-3 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-black transition-all shadow-xl shadow-gray-100">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
