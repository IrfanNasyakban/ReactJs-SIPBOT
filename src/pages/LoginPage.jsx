/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import { HiEye, HiEyeOff, HiUser, HiLockClosed } from "react-icons/hi";

import mascotImg from "../assets/mascot.png";
import imigrasiImg from "../assets/logo_imigrasi.png";
import pemasyarakatanImg from "../assets/logo_pemasyarakatan.png";

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
    if (user || isSuccess) navigate("/dashboard");
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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#040c24]">

      {/* ── Background: grid + orbs + scanlines ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,139,255,.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,139,255,.07) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(56,139,255,.018) 3px, rgba(56,139,255,.018) 4px
          )`,
        }}
      />
      {/* Orb 1 */}
      <div
        className="absolute rounded-full pointer-events-none animate-[orb1_10s_ease-in-out_infinite]"
        style={{
          width: 420, height: 420,
          background: "rgba(24,95,165,.35)",
          filter: "blur(80px)",
          top: -120, left: -60,
        }}
      />
      {/* Orb 2 */}
      <div
        className="absolute rounded-full pointer-events-none animate-[orb2_13s_ease-in-out_infinite]"
        style={{
          width: 380, height: 380,
          background: "rgba(10,40,120,.4)",
          filter: "blur(80px)",
          bottom: -100, right: -80,
        }}
      />

      {/* ── Main layout ── */}
      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 items-center gap-14">

        {/* LEFT: Logos */}
        <div className="hidden lg:flex flex-col items-center gap-8">

          {/* Logo pair */}
          <div className="flex items-center gap-6">
            {/* Logo Imigrasi */}
            <div className="flex flex-col items-center gap-3 animate-[float1_6s_ease-in-out_infinite]">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center relative"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1.5px solid rgba(56,139,255,.3)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <img
                  src={imigrasiImg}
                  alt="Logo Imigrasi"
                  className="w-24 h-24 object-contain select-none"
                  draggable={false}
                />
              </div>
            </div>

            {/* Divider */}
            <div
              className="w-px h-16"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(56,139,255,.4), transparent)",
              }}
            />

            {/* Logo Pemasyarakatan */}
            <div className="flex flex-col items-center gap-3 animate-[float2_7s_ease-in-out_infinite]">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center relative"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1.5px solid rgba(56,139,255,.3)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <img
                  src={pemasyarakatanImg}
                  alt="Logo Pemasyarakatan"
                  className="w-24 h-24 object-contain select-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Keterangan kementerian */}
          <div className="text-center">
            <p className="text-sm font-medium tracking-wide"
               style={{ color: "rgba(200,225,255,.75)" }}>
              Kementerian Imigrasi dan Pemasyarakatan
              <br />
              Kantor Wilayah Direktorat Jenderal Imigrasi Aceh
              <br />
              Kantor Imigrasi Kelas II TPI Lhokseumawe
            </p>
          </div>

          {/* Dekoratif garis */}
          <div className="flex items-center gap-4">
            <div className="h-px w-12"
                 style={{ background: "linear-gradient(to right,transparent,rgba(56,139,255,.4))" }} />
            <svg width="12" height="12" viewBox="0 0 14 14">
              <polygon points="7,1 8.5,5.5 13,5.5 9.3,8.5 10.8,13 7,10.2 3.2,13 4.7,8.5 1,5.5 5.5,5.5"
                fill="rgba(255,200,80,.5)" />
            </svg>
            <div className="h-px w-12"
                 style={{ background: "linear-gradient(to left,transparent,rgba(56,139,255,.4))" }} />
          </div>
        </div>

        {/* RIGHT: Form */}
        <div
          className="w-full max-w-sm mx-auto lg:mx-0 rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(56,139,255,.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Top highlight line */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(56,139,255,.6), transparent)",
            }}
          />

          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(56,139,255,.15)",
                border: "1px solid rgba(56,139,255,.3)",
              }}
            >
              <img
                src={mascotImg}
                alt="SIPBOT"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-[3px] text-white">
                SIP<span className="text-blue-400">BOT</span>
              </h2>
              <p className="text-[10px] tracking-wide" style={{ color: "rgba(255,255,255,.35)" }}>
                Sistem Informasi Pegawai berbasis ChatBot
              </p>
            </div>
          </div>

          {/* Welcome */}
          <div className="mb-7">
            <h1 className="text-lg font-semibold text-white">
              Selamat Datang di{" "}
              <span className="text-blue-400">SIPBOT</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,.4)" }}>
              Masukkan kredensial Anda untuk melanjutkan
            </p>
          </div>

          {/* Error Alert */}
          {isError && (
            <div
              className="mb-5 p-3 rounded-lg text-sm"
              style={{
                background: "rgba(220,38,38,.08)",
                border: "1px solid rgba(220,38,38,.35)",
                color: "#fca5a5",
              }}
            >
              {message}
            </div>
          )}

          {/* Success Alert */}
          {isSuccess && (
            <div
              className="mb-5 p-3 rounded-lg text-sm"
              style={{
                background: "rgba(34,197,94,.08)",
                border: "1px solid rgba(34,197,94,.35)",
                color: "#86efac",
              }}
            >
              Login berhasil!
            </div>
          )}
          <>
          <form onSubmit={Auth} className="space-y-5">

            {/* Username */}
            <div>
              <label
                className="block text-[10px] font-semibold mb-2 tracking-[2px] uppercase"
                style={{ color: "rgba(255,255,255,.4)" }}
              >
                Username
              </label>
              <div className="relative">
                <HiUser
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "rgba(255,255,255,.25)" }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white transition-all duration-200 focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.12)",
                    "::placeholder": { color: "rgba(255,255,255,.2)" },
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(56,139,255,.7)";
                    e.target.style.background = "rgba(56,139,255,.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,.12)";
                    e.target.style.background = "rgba(255,255,255,.06)";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[10px] font-semibold mb-2 tracking-[2px] uppercase"
                style={{ color: "rgba(255,255,255,.4)" }}
              >
                Password
              </label>
              <div className="relative">
                <HiLockClosed
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "rgba(255,255,255,.25)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white transition-all duration-200 focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.12)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(56,139,255,.7)";
                    e.target.style.background = "rgba(56,139,255,.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,.12)";
                    e.target.style.background = "rgba(255,255,255,.06)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,.25)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#60a5fa")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.25)")}
                >
                  {showPassword ? (
                    <HiEyeOff className="w-4 h-4" />
                  ) : (
                    <HiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="text-right -mt-2">
              <a
                href="#"
                className="text-xs transition-colors duration-200 hover:text-blue-400"
                style={{ color: "rgba(255,255,255,.3)" }}
              >
                Lupa kata sandi?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #1d6fe8 0%, #0ea5e9 100%)",
                boxShadow: "0 4px 24px rgba(29,111,232,.35)",
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.opacity = ".88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>LOGIN</span>
              )}
            </button>
          </form>
          </>

          {/* Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <div className="h-1.5 w-6 rounded-full bg-blue-500" />
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: "rgba(255,255,255,.15)" }} />
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] mt-4" style={{ color: "rgba(255,255,255,.15)" }}>
            © 2026 SIPBOT. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;