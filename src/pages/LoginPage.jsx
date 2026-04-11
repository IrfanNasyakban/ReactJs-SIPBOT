/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import { HiEye, HiEyeOff, HiUser, HiLockClosed } from "react-icons/hi";

import mascotImg from "../assets/mascot.png";
import backgroundImg from "../assets/background.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
    if (isError) {
      const timer = setTimeout(() => dispatch(reset()), 3000);
      return () => clearTimeout(timer);
    }
  }, [user, isSuccess, isError, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ username, password }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#05091f]/40 pointer-events-none" />

      {/* Main layout */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-8">

        {/* Kiri: Mascot */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <img
            src={mascotImg}
            alt="SIPBOT Mascot"
            className="w-72 xl:w-80 object-contain select-none drop-shadow-2xl animate-bounce"
            draggable={false}
          />
        </div>

        {/* Kanan: Form Login */}
        <div className="flex-1 max-w-sm w-full mx-auto lg:mx-0">

          {/* Logo SIPBOT */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src={mascotImg}
              alt="SIPBOT Logo"
              className="w-11 h-11 object-contain rounded-full bg-blue-500/10"
            />
            <div>
              <h2 className="text-xl font-bold tracking-widest text-white">
                SIP<span className="text-blue-400">BOT</span>
              </h2>
              <p className="text-xs text-white/40 leading-tight">
                Sistem Informasi Pegawai berbasis ChatBot
              </p>
            </div>
          </div>

          {/* Welcome text */}
          <div className="mb-7">
            <h1 className="text-xl font-semibold text-white">
              Selamat Datang di{" "}
              <span className="text-blue-400">SIPBOT</span>
            </h1>
            <p className="text-sm mt-1 text-white/40">
              Please login to your account
            </p>
          </div>

          {/* Error Alert */}
          {isError && (
            <div className="mb-5 p-3 rounded-lg text-sm bg-red-500/10 border border-red-500/40 text-red-400">
              {message}
            </div>
          )}

          {/* Success Alert */}
          {isSuccess && (
            <div className="mb-5 p-3 rounded-lg text-sm bg-green-500/10 border border-green-500/40 text-green-400">
              Login berhasil!
            </div>
          )}
          <>

          <form onSubmit={Auth} className="space-y-5">

            {/* Username Field */}
            <div>
              <label className="block text-xs font-medium mb-2 tracking-widest uppercase text-white/45">
                Username
              </label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg text-sm text-white placeholder-white/25 bg-white/[0.07] border border-white/[0.13] focus:outline-none focus:border-blue-500 focus:bg-blue-500/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium mb-2 tracking-widest uppercase text-white/45">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-lg text-sm text-white placeholder-white/25 bg-white/[0.07] border border-white/[0.13] focus:outline-none focus:border-blue-500 focus:bg-blue-500/10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-blue-400 transition-colors duration-200"
                >
                  {showPassword ? (
                    <HiEyeOff className="w-4 h-4" />
                  ) : (
                    <HiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right -mt-1">
              <a
                href="#"
                className="text-xs text-white/35 hover:text-blue-400 transition-colors duration-200"
              >
                Lupa kata sandi?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200 shadow-lg shadow-blue-600/40"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
          </>

          {/* Dots indicator */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <div className="h-1.5 w-5 rounded-full bg-blue-500" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>

          {/* Footer */}
          <p className="text-center text-xs mt-4 text-white/20">
            © 2026 SIPBOT. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;