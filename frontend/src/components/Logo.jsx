import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

const Logo = ({ size = 'md', className = '' }) => {
  const [customLogo, setCustomLogo] = useState(null);

  const loadLogo = () => {
    const savedLogo = localStorage.getItem('rajarata_custom_logo');

    if (savedLogo) {
      setCustomLogo(savedLogo);
    } else {
      const img = new Image();

      img.src = '/logo.png';

      img.onload = () => {
        setCustomLogo('/logo.png');
      };

      img.onerror = () => {
        setCustomLogo(null);
      };
    }
  };

  useEffect(() => {
    loadLogo();

    window.addEventListener('rajarata_logo_changed', loadLogo);

    return () => {
      window.removeEventListener('rajarata_logo_changed', loadLogo);
    };
  }, []);

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-16 h-16 rounded-3xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`
        relative
        flex items-center justify-center
        overflow-hidden
        flex-shrink-0
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {customLogo ? (
        <img
          src={customLogo}
          alt="RajaRata DayTrail Logo"
          className="
            w-full h-full
            object-contain
            p-1
            drop-shadow-md
            transition-transform duration-300
            group-hover:scale-105
          "
        />
      ) : (
        <div className="relative w-full h-full">
          <div
            className="
              absolute -inset-1
              bg-gradient-to-r
              from-amber-600
              to-orange-500
              rounded-2xl
              blur-xs
              opacity-60
              group-hover:opacity-100
              transition duration-300
            "
          />

          <div
            className="
              relative
              w-full h-full
              bg-gradient-to-tr
              from-stone-950
              via-amber-900
              to-amber-600
              flex items-center justify-center
              text-white
              shadow-md
              rounded-2xl
            "
          >
            <Compass
              className={`
                ${iconSizes[size]}
                transform
                text-amber-300
                group-hover:rotate-90
                transition-transform
                duration-700
                ease-out
              `}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;