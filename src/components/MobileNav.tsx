import { useState, useEffect } from 'react';
import { Menu, X, DollarSign, User, Palette } from 'lucide-react';
import { CurrencySelector } from '@/components/dashboard/CurrencySelector';
import { RoleToggle } from '@/components/dashboard/RoleToggle';
import { DarkModeToggle } from '@/components/dashboard/DarkModeToggle';

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Disable scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Visible only on mobile */}
      <button
        onClick={toggleMenu}
        className={`md:hidden relative z-50 p-2.5 rounded-lg transition-all duration-300 animate-fade-in ${
          isDark
            ? 'backdrop-blur-2xl bg-white/10 border border-white/20 hover:border-blue-400/60 hover:bg-blue-500/20 hover:backdrop-blur-3xl'
            : 'backdrop-blur-2xl bg-white/15 border border-white/30 hover:border-blue-400/60 hover:bg-blue-400/20 hover:backdrop-blur-3xl'
        }`}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className={`w-6 h-6 transition-transform duration-300 rotate-90 drop-shadow-lg ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`} />
        ) : (
          <Menu className={`w-6 h-6 transition-all duration-300 ${
            isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-600'
          }`} />
        )}
      </button>

      {/* Backdrop with Strong Blur - Click to close */}
      {isOpen && (
        <div
          className={`md:hidden fixed inset-0 top-16 z-30 animate-fade-in backdrop-blur-3xl ${
            isDark ? 'bg-black/75' : 'bg-black/70'
          }`}
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu - Visible only on mobile and when open */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 animate-slide-in-down">
          <nav className={`w-full max-h-[calc(100vh-4rem)] transition-all  ${isDark} duration-300 border-b overflow-y-auto ${
            isDark
              ? 'backdrop-blur-3xl bg-gradient-to-b'
              : 'backdrop-blur-3xl bg-gradient-to-b'
          }`}>
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
              {/* Header */}
              <div className="mb-3">
                <h2 className={`text-lg font-bold bg-gradient-to-r ${
                  isDark
                    ? 'from-blue-400 to-purple-400'
                    : 'from-blue-600 to-purple-600'
                } bg-clip-text text-transparent`}>
                  Navigation
                </h2>
              </div>

              {/* Menu Items */}
              <div className="space-y-4">
                {/* Currency Section */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-2 pl-1">
                    <DollarSign className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Currency
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl transition-all duration-300 ${
                    isDark
                      ? 'backdrop-blur-3xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 hover:border-blue-400/80 hover:bg-gradient-to-br hover:from-blue-500/25 hover:to-blue-400/15 hover:shadow-lg hover:shadow-blue-500/30'
                      : 'backdrop-blur-3xl bg-gradient-to-br from-white/35 to-white/25 border border-white/40 hover:border-blue-400/80 hover:bg-gradient-to-br hover:from-blue-400/30 hover:to-blue-300/20 hover:shadow-lg hover:shadow-blue-400/30'
                  }`}>
                    <CurrencySelector />
                  </div>
                </div>

                {/* Role Section */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-2 pl-1">
                    <User className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      User Role
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl transition-all duration-300 ${
                    isDark
                      ? 'backdrop-blur-3xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 hover:border-purple-400/80 hover:bg-gradient-to-br hover:from-purple-500/25 hover:to-purple-400/15 hover:shadow-lg hover:shadow-purple-500/30'
                      : 'backdrop-blur-3xl bg-gradient-to-br from-white/35 to-white/25 border border-white/40 hover:border-purple-400/80 hover:bg-gradient-to-br hover:from-purple-400/30 hover:to-purple-300/20 hover:shadow-lg hover:shadow-purple-400/30'
                  }`}>
                    <RoleToggle />
                  </div>
                </div>

                {/* Theme Section */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-2 pl-1">
                    <Palette className={`w-4 h-4 ${isDark ? 'text-amber-600' : 'text-amber-600'}`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Theme
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl transition-all duration-300 ${
                    isDark
                      ? 'backdrop-blur-3xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 hover:border-amber-400/80 hover:bg-gradient-to-br hover:from-amber-500/25 hover:to-amber-400/15 hover:shadow-lg hover:shadow-amber-500/30'
                      : 'backdrop-blur-3xl bg-gradient-to-br from-white/35 to-white/25 border border-white/40 hover:border-amber-400/80 hover:bg-gradient-to-br hover:from-amber-400/30 hover:to-amber-300/20 hover:shadow-lg hover:shadow-amber-400/30'
                  }`}>
                    <DarkModeToggle />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-px bg-gradient-to-r ${
                isDark
                  ? 'from-transparent via-white/20 to-transparent'
                  : 'from-transparent via-white/40 to-transparent'
              } my-2`} />
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Menu - Visible only on desktop */}
      <div className="hidden md:flex items-center gap-65">
        <CurrencySelector />
        <RoleToggle />
        <DarkModeToggle />
      </div>
    </>
  );
};
