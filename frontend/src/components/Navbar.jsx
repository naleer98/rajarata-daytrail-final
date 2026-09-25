import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

import {
  Compass,
  MapPin,
  Calendar,
  Bookmark,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'ta', label: 'தமிழ்', short: 'தமிழ்', flag: '🇱🇰' },
  { code: 'si', label: 'සිංහල', short: 'සිංහල', flag: '🇱🇰' },
];

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) => {
    const active = isActive(path);

    return `
      group relative flex min-w-0 items-center gap-1.5
      rounded-xl px-2.5 py-2
      text-[12px] font-semibold
      whitespace-nowrap
      transition-all duration-300
      ${
        active
          ? `
              text-amber-700 dark:text-amber-300
              bg-white dark:bg-stone-800
              shadow-sm
              ring-1 ring-black/5 dark:ring-white/10
            `
          : `
              text-stone-600 dark:text-stone-300
              hover:text-stone-950 dark:hover:text-white
              hover:bg-white/75 dark:hover:bg-stone-800/80
            `
      }
    `;
  };

  const navIconClass = (path) => {
    return `
      h-[15px] w-[15px] shrink-0
      transition-all duration-300
      ${
        isActive(path)
          ? 'text-amber-600 dark:text-amber-300'
          : 'text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400'
      }
    `;
  };

  const currentLangObj =
    languages.find((language) => language.code === lang) || languages[0];

  const ActiveLine = () => (
    <span
      className="
        absolute bottom-0.5 left-1/2
        h-[2px] w-5 -translate-x-1/2
        rounded-full bg-amber-500
      "
    />
  );

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-stone-200/70 dark:border-stone-800/80
        bg-white/95 dark:bg-stone-950/95
        backdrop-blur-2xl
        shadow-[0_1px_20px_rgba(0,0,0,0.035)]
        transition-colors duration-300
      "
    >
      <div className="mx-auto w-full max-w-[1920px] px-3 sm:px-4 xl:px-5">
        <div className="flex h-[72px] min-w-0 items-center gap-3">

          {/* ================= BRAND ================= */}

          <Link
            to="/"
            className="
              group flex shrink-0 items-center gap-2.5
              rounded-2xl transition-all duration-300
            "
          >
            <div className="relative shrink-0">
              <Logo size="md" />
            </div>

            <div className="hidden sm:block leading-none">
              <div className="flex items-center gap-2">
                <div className="whitespace-nowrap text-[18px] font-black tracking-[-0.04em] text-stone-950 dark:text-white">
                  RajaRata
                  <span className="ml-1.5 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    DayTrail
                  </span>
                </div>

                <span
                  className="
                    rounded-md border border-amber-300/70
                    bg-amber-50 px-1.5 py-1
                    text-[8px] font-black uppercase tracking-[0.12em]
                    text-amber-800
                    dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300
                  "
                >
                  25 KM
                </span>
              </div>

              <div
                className="
                  mt-1 hidden
                  text-[8px] font-bold uppercase tracking-[0.16em]
                  text-stone-400 dark:text-stone-500
                  min-[1700px]:block
                "
              >
                Anuradhapura Visit Planner
              </div>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}

          <nav
            className="
              ml-auto hidden min-w-0 items-center gap-0.5
              rounded-2xl border border-stone-200/80
              bg-stone-100/70 p-1
              shadow-inner
              dark:border-stone-800 dark:bg-stone-900/80
              xl:flex
            "
          >
            <Link to="/" className={navLinkClass('/')} title={t('home')}>
              <Compass className={navIconClass('/')} />
              <span>{t('home')}</span>
              {isActive('/') && <ActiveLine />}
            </Link>

            <Link
              to="/explore"
              className={navLinkClass('/explore')}
              title={t('explore')}
            >
              <MapPin className={navIconClass('/explore')} />
              <span>{t('explore')}</span>
              {isActive('/explore') && <ActiveLine />}
            </Link>

            <Link to="/map" className={navLinkClass('/map')} title={t('map')}>
              <Compass className={navIconClass('/map')} />
              <span>{t('map')}</span>
              {isActive('/map') && <ActiveLine />}
            </Link>

            <Link
              to="/planner"
              className={navLinkClass('/planner')}
              title={t('planner')}
            >
              <Calendar className={navIconClass('/planner')} />
              <span>{t('planner')}</span>
              {isActive('/planner') && <ActiveLine />}
            </Link>

            {user && (
              <Link
                to="/saved-plans"
                className={navLinkClass('/saved-plans')}
                title={t('myPlans')}
              >
                <Bookmark className={navIconClass('/saved-plans')} />
                <span>{t('myPlans')}</span>
                {isActive('/saved-plans') && <ActiveLine />}
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={navLinkClass('/admin')}
                title={t('admin')}
              >
                <ShieldCheck className={navIconClass('/admin')} />
                <span>{t('admin')}</span>
                {isActive('/admin') && <ActiveLine />}
              </Link>
            )}
          </nav>

          {/* ================= RIGHT CONTROLS ================= */}

          <div className="hidden shrink-0 items-center gap-1.5 md:flex">

            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={t('toggleTheme')}
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl border border-stone-200
                bg-white text-stone-500 shadow-sm
                transition-all duration-300
                hover:-translate-y-0.5 hover:border-amber-300
                hover:text-amber-600 hover:shadow-md
                dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300
                dark:hover:border-amber-700 dark:hover:text-amber-400
              "
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Language */}
            <div ref={langDropdownRef} className="relative shrink-0">
              <button
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                className="
                  flex h-10 items-center gap-2
                  rounded-xl border border-stone-200
                  bg-white px-3
                  text-xs font-bold text-stone-700
                  shadow-sm transition-all duration-300
                  hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md
                  dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200
                  dark:hover:border-amber-700
                "
              >
                <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>{currentLangObj.short}</span>

                <ChevronDown
                  className={`
                    h-3.5 w-3.5 text-stone-400
                    transition-transform duration-200
                    ${langDropdownOpen ? 'rotate-180' : ''}
                  `}
                />
              </button>

              {langDropdownOpen && (
                <div
                  className="
                    absolute right-0 top-full z-[70]
                    mt-3 w-44 overflow-hidden
                    rounded-2xl border border-stone-200/80
                    bg-white/95 p-1.5
                    shadow-[0_20px_50px_rgba(0,0,0,0.14)]
                    backdrop-blur-xl
                    dark:border-stone-800 dark:bg-stone-900/95
                  "
                >
                  {languages.map((language) => {
                    const selected = language.code === lang;

                    return (
                      <button
                        key={language.code}
                        onClick={() => {
                          setLang(language.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`
                          flex w-full items-center justify-between
                          rounded-xl px-3 py-2.5
                          text-xs font-semibold transition-colors
                          ${
                            selected
                              ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                              : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
                          }
                        `}
                      >
                        <span className="flex items-center gap-2.5">
                          <span>{language.flag}</span>
                          <span>{language.label}</span>
                        </span>

                        {selected && (
                          <span className="font-black text-amber-600">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Logged User */}
            {user ? (
              <div
                className="
                  flex h-11 shrink-0 items-center gap-2
                  rounded-2xl border border-stone-200
                  bg-white px-1.5 shadow-sm
                  dark:border-stone-800 dark:bg-stone-900
                "
              >
                <div
                  className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-xl
                    bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700
                    text-xs font-black text-white
                    shadow-md shadow-amber-600/20
                  "
                >
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                {/* Keep text hidden on tighter desktop widths.
                    It appears only when there is genuinely enough room. */}
                <div className="hidden min-w-0 pl-0.5 min-[1800px]:block">
                  <div
                    className="
                      max-w-[105px] truncate
                      text-[11px] font-bold leading-tight
                      text-stone-900 dark:text-white
                    "
                    title={user.name}
                  >
                    {user.name}
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[8px] font-black uppercase tracking-[0.12em]
                      text-amber-600 dark:text-amber-400
                    "
                  >
                    {user.role === 'admin'
                      ? t('roleAdmin')
                      : t('roleTourist')}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title={t('logout')}
                  className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-lg text-stone-400
                    transition-all duration-200
                    hover:bg-red-50 hover:text-red-600
                    dark:hover:bg-red-950/40 dark:hover:text-red-400
                  "
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="
                    rounded-xl px-3 py-2
                    text-xs font-bold text-stone-700
                    transition-colors
                    hover:bg-stone-100 hover:text-amber-700
                    dark:text-stone-200 dark:hover:bg-stone-900
                    dark:hover:text-amber-400
                  "
                >
                  {t('signIn')}
                </Link>

                <Link
                  to="/register"
                  className="
                    flex items-center gap-1.5 rounded-xl
                    bg-gradient-to-r from-amber-600 to-orange-500
                    px-3.5 py-2
                    text-xs font-black text-white
                    shadow-lg shadow-amber-500/20
                    transition-all duration-300
                    hover:-translate-y-0.5 hover:shadow-xl
                    hover:shadow-amber-500/30
                  "
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('signUp')}
                </Link>
              </div>
            )}
          </div>

          {/* ================= MOBILE ================= */}

          <div className="ml-auto flex items-center gap-2 xl:hidden">
            <button
              onClick={toggleTheme}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl border border-stone-200
                bg-stone-50 text-stone-600
                dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300
              "
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                bg-gradient-to-br from-amber-600 to-orange-500
                text-white shadow-lg shadow-amber-500/20
              "
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}

      {mobileMenuOpen && (
        <div
          className="
            border-t border-stone-200
            bg-white/95 px-4 pb-6 pt-4
            backdrop-blur-2xl
            dark:border-stone-800 dark:bg-stone-950/95
            xl:hidden
          "
        >
          <div className="mx-auto max-w-xl space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass('/')}
            >
              <Compass className={navIconClass('/')} />
              {t('home')}
            </Link>

            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass('/explore')}
            >
              <MapPin className={navIconClass('/explore')} />
              {t('explore')}
            </Link>

            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass('/map')}
            >
              <Compass className={navIconClass('/map')} />
              {t('map')}
            </Link>

            <Link
              to="/planner"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass('/planner')}
            >
              <Calendar className={navIconClass('/planner')} />
              {t('planner')}
            </Link>

            {user && (
              <Link
                to="/saved-plans"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/saved-plans')}
              >
                <Bookmark className={navIconClass('/saved-plans')} />
                {t('myPlans')}
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/admin')}
              >
                <ShieldCheck className={navIconClass('/admin')} />
                {t('admin')}
              </Link>
            )}

            {/* Mobile language */}
            <div className="mt-4 border-t border-stone-200 pt-4 dark:border-stone-800">
              <div
                className="
                  mb-2 text-[10px] font-black uppercase
                  tracking-[0.15em] text-stone-400
                "
              >
                {t('switchLanguage')}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => setLang(language.code)}
                    className={`
                      rounded-xl border px-2 py-2.5
                      text-xs font-bold transition-all
                      ${
                        lang === language.code
                          ? 'border-amber-500 bg-amber-500 text-white shadow-md'
                          : 'border-stone-200 bg-stone-50 text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300'
                      }
                    `}
                  >
                    {language.flag} {language.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile user */}
            <div className="mt-4 border-t border-stone-200 pt-4 dark:border-stone-800">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-stone-900 dark:text-white">
                      {user.name}
                    </div>

                    <div className="truncate text-xs text-stone-400">
                      {user.email}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="
                      flex items-center gap-1.5 rounded-xl
                      bg-red-50 px-3 py-2
                      text-xs font-bold text-red-600
                      dark:bg-red-950/40 dark:text-red-400
                    "
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      rounded-xl border border-stone-200 py-2.5
                      text-center text-xs font-bold text-stone-700
                      dark:border-stone-700 dark:text-stone-200
                    "
                  >
                    {t('signIn')}
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      rounded-xl
                      bg-gradient-to-r from-amber-600 to-orange-500
                      py-2.5 text-center
                      text-xs font-bold text-white
                    "
                  >
                    {t('signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
