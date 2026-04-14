import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

import { AiOutlineMenu, AiOutlineSetting } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";

import avatar from "../assets/avatar.jpg";
import { UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";

const NavButton = ({ title, customFunc, icon, currentColor, currentMode }) => {
  const isDark = currentMode === 'Dark';
  return (
    <button
      type="button"
      onClick={() => customFunc()}
      className={`text-lg rounded-lg p-2.5 transition-all duration-300 relative group ${
        isDark 
          ? 'text-gray-300 hover:text-white' 
          : 'text-gray-700 hover:text-gray-900'
      }`}
      title={title}
      style={{
        borderRadius: '10px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {icon}
    </button>
  );
};

const Navbar = () => {
  const [urlImage, setUrlImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const {
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
    currentColor,
    currentMode,
    setThemeSettings
  } = useStateContext();

  // Helper function for colors with opacity
  const getColorWithOpacity = (color, opacity) => {
    if (!color) return `rgba(168, 85, 247, ${opacity})`; // Default purple
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const safeColor = currentColor || '#A855F7'; // Fallback to purple

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (user && user.role === "guru") {
        getProfileGuru();
      } else if (user && user.role === "siswa") {
        getProfileSiswa();
      }
    } else {
      navigate("/login");
    }
  }, [navigate, user]);

  const getProfileSiswa = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/profile-siswa`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        const profileData = response.data.data;
        setUrlImage(profileData.url);
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile siswa:", error);
    }
  };

  const getProfileGuru = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/profile-guru`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        const profileData = response.data.data;
        setUrlImage(profileData.url);
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile guru:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const isDark = currentMode === 'Dark';

  return (
    <div 
      className={`flex justify-between items-center px-6 py-4 relative z-50 border-b backdrop-blur-sm transition-colors duration-300 ${
        isDark 
           ? 'bg-[#040c24]/80 border-gray-900' 
          : 'bg-white/80 border-gray-200'
      }`}
    >
      {/* Left Section - Menu Button */}
      <div className="flex items-center gap-2">
        <NavButton
          title="Menu"
          customFunc={handleActiveMenu}
          icon={<AiOutlineMenu />}
          currentColor={currentColor}
          currentMode={currentMode}
        />
      </div>

      {/* Right Section - Settings & User Profile */}
      <div className="flex items-center gap-1">
        {/* Theme Settings Button */}
        <NavButton
          title="Settings"
          customFunc={() => setThemeSettings(true)}
          icon={<AiOutlineSetting />}
          currentColor={currentColor}
          currentMode={currentMode}
        />

        {/* User Profile Dropdown */}
        <div
          className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-all duration-300 relative z-50 ${
            isDark 
              ? 'hover:bg-gray-800/50' 
              : 'hover:bg-gray-100/50'
          }`}
          onClick={() => handleClick("userProfile")}
        >
          <img
            className="rounded-full w-9 h-9 border-2 transition-transform duration-300 hover:scale-110"
            style={{ borderColor: safeColor }}
            src={urlImage && urlImage !== "http://localhost:5000/images/null" ? urlImage : avatar}
            alt="user-profile"
          />
          
          <div className="hidden md:block">
            <p 
              className={`text-sm font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              {user ? capitalizeFirstLetter(user.username) : "Admin"}
            </p>
          </div>
          
          <MdKeyboardArrowDown 
            className={`text-lg transition-transform duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            } ${isClicked.userProfile ? 'rotate-180' : ''}`}
          />
        </div>

        {/* User Profile Dropdown Menu */}
        {isClicked.userProfile && (
          <div className="absolute top-full right-6 mt-3 z-[9999]">
            <UserProfile />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;