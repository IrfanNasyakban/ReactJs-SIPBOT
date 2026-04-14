import React from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaRobot, FaHeadset, FaLightbulb } from 'react-icons/fa';

const Footer = () => {
  const { currentColor, currentMode } = useStateContext();

  // Helper function for colors with opacity
  const getColorWithOpacity = (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const isDark = currentMode === 'Dark';

  return (
    <div className="mt-16 relative overflow-hidden">

      {/* Decorative top border */}
      <div 
        className="h-px w-full relative z-10"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${currentColor}, transparent)` 
        }}
      />
      
      {/* Footer Content */}
      <footer 
        className={`py-12 px-6 relative z-10 ${
          isDark ? 'bg-[#040c24]' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Divider */}
          <div 
            className="h-px w-full mb-8"
            style={{ 
              background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"
            }}
          />

          {/* Bottom Info Section */}
          <div 
            className="text-center space-y-3"
          >
            <p 
              className={`text-sm font-semibold ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Kementerian Imigrasi dan Pemasyarakatan
              <br />
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Kantor Imigrasi Kelas II TPI Lhokseumawe
              </span>
            </p>
            
            <div 
              className="pt-4"
              style={{ 
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}` 
              }}
            >
              <p 
                className={`text-xs ${
                  isDark ? 'text-gray-500' : 'text-gray-600'
                }`}
              >
                © 2026 <span style={{ color: currentColor }} className="font-semibold">SIPBOT</span> - Sistem Informasi Pegawai berbasis ChatBot AI
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;