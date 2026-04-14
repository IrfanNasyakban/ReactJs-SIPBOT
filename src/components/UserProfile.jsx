import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getMe, LogOut, reset } from "../features/authSlice";

import { MdOutlineCancel } from "react-icons/md";
import { FaSignOutAlt, FaUser, FaEnvelope, FaClock } from "react-icons/fa";

import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../assets/avatar.jpg";

const UserProfile = () => {
  const [nama, setNama] = useState(null);
  const [urlImage, setUrlImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentColor, currentMode, setIsClicked, initialState } = useStateContext();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && user) {
      fetchUserProfile();
    }
  }, [user]);

  const isDark = currentMode === 'Dark';

  // Fetch user profile based on role
  const fetchUserProfile = async () => {
    if (!user || user.role === 'admin') return;

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const endpoint = user.role === "guru" ? "/profile-guru" : "/profile-siswa";
      
      const response = await axios.get(`${apiUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.data?.url) {
        setUrlImage(response.data.data.url);
        setNama(response.data.data.nama);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClicked(initialState);
  };

  const handleLogout = async () => {
    try {
      await dispatch(LogOut());
      dispatch(reset());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Helper function for colors with opacity
  const getColorWithOpacity = (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div 
      className={`rounded-2xl w-96 shadow-2xl z-[9999] relative border overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'bg-[#040c24]/95 border-gray-900' 
          : 'bg-white/95 border-gray-200'
      }`}
      style={{
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"}`,
      }}
    >
      {/* Top highlight line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${currentColor}, transparent)`,
        }}
      />

      {/* Header */}
      <div 
        className={`p-5 border-b ${
          isDark ? 'border-gray-900' : 'border-gray-200'
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 
              className={`font-bold text-lg ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            >
              <span style={{ color: currentColor }}>My</span> Profile
            </h3>
            <p 
              className={`text-xs mt-1 ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}
            >
              Manage your account
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-900/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
            <MdOutlineCancel className="text-lg" />
          </button>
        </div>
      </div>

      {/* User Info Section */}
      <div className="p-5 space-y-4">
        {/* Avatar and Basic Info */}
        <div 
          className={`rounded-xl p-5 border transition-all duration-300 ${
            isDark 
              ? 'bg-gray-900/30 border-gray-900' 
              : 'bg-gray-50/50 border-gray-200'
          }`}
          style={{
            background: isDark 
              ? "rgba(255,255,255,.015)" 
              : "rgba(0,0,0,.02)",
            border: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)"}`,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Avatar */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-shrink-0">
              {loading ? (
                <div 
                  className="w-16 h-16 rounded-lg animate-pulse"
                  style={{ backgroundColor: getColorWithOpacity(currentColor, 0.2) }}
                />
              ) : (
                <div style={{ position: 'relative' }}>
                  <img
                    className="w-16 h-16 rounded-lg object-cover border-2 transition-transform duration-300 hover:scale-105"
                    style={{ borderColor: currentColor }}
                    src={urlImage && urlImage !== "http://localhost:5000/images/null" ? urlImage : avatar}
                    alt="user-profile"
                    onError={(e) => {
                      e.target.src = avatar;
                    }}
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2"
                    style={{ 
                      background: currentColor,
                      borderColor: isDark ? '#040c24' : 'white'
                    }}
                  />
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <h4 
                className={`font-semibold text-base truncate ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                {nama ? capitalizeFirstLetter(nama) : capitalizeFirstLetter(user?.username || "Admin")}
              </h4>
              <p 
                className={`text-sm truncate mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {user?.role || 'Administrator'}
              </p>
              <span 
                className="text-xs px-3 py-1.5 rounded-lg mt-2 inline-block font-semibold transition-all duration-300"
                style={{ 
                  backgroundColor: getColorWithOpacity(currentColor, 0.15),
                  color: currentColor,
                  border: `1px solid ${getColorWithOpacity(currentColor, 0.3)}`
                }}
              >
                {user?.role === 'guru' ? '👨‍🏫 Guru' : user?.role === 'siswa' ? '🎓 Siswa' : '⚙️ Admin'}
              </span>
            </div>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="space-y-3">
          {/* Email Info */}
          <div 
            className={`flex items-center gap-3 p-3 rounded-lg ${
              isDark 
                ? 'bg-gray-900/30' 
                : 'bg-gray-50/50'
            }`}
            style={{
              background: isDark 
                ? "rgba(255,255,255,.015)" 
                : "rgba(0,0,0,.02)",
              border: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)"}`,
            }}
          >
            <FaEnvelope style={{ color: currentColor }} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Email
              </p>
              <p className={`text-sm truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {user?.email || "user@sipbot.com"}
              </p>
            </div>
          </div>

          {/* Username Info */}
          <div 
            className={`flex items-center gap-3 p-3 rounded-lg ${
              isDark 
                ? 'bg-gray-900/30' 
                : 'bg-gray-50/50'
            }`}
            style={{
              background: isDark 
                ? "rgba(255,255,255,.015)" 
                : "rgba(0,0,0,.02)",
              border: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)"}`,
            }}
          >
            <FaUser style={{ color: currentColor }} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Username
              </p>
              <p className={`text-sm truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {user?.username || "admin"}
              </p>
            </div>
          </div>

          {/* Last Login Info */}
          <div 
            className={`flex items-center gap-3 p-3 rounded-lg ${
              isDark 
                ? 'bg-gray-900/30' 
                : 'bg-gray-50/50'
            }`}
            style={{
              background: isDark 
                ? "rgba(255,255,255,.015)" 
                : "rgba(0,0,0,.02)",
              border: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)"}`,
            }}
          >
            <FaClock style={{ color: currentColor }} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Session Status
              </p>
              <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                ● Active
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 mt-4"
          style={{
            background: `linear-gradient(135deg, ${currentColor}, ${getColorWithOpacity(currentColor, 0.8)})`,
            boxShadow: `0 4px 16px ${getColorWithOpacity(currentColor, 0.3)}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;