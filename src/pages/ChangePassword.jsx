import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi";
import {
  HiEye,
  HiEyeOff,
  HiLockClosed,
  HiCheckCircle,
  HiXCircle,
  HiShieldCheck,
} from "react-icons/hi";

// ── Password strength calculator ─────────────────────────
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Lemah", color: "#ef4444" };
  if (score <= 2) return { score, label: "Sedang", color: "#f59e0b" };
  if (score <= 3) return { score, label: "Cukup", color: "#3b82f6" };
  return { score, label: "Kuat", color: "#10b981" };
}

// ── Field Component ───────────────────────────────────────
function PasswordField({ label, value, onChange, placeholder, show, onToggle, currentColor, isDark, hint }) {
  const [focused, setFocused] = useState(false);
  const hex = currentColor || "#A855F7";
  const rgb = [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ].join(",");

  return (
    <div>
      <label
        className="block text-sm font-semibold mb-2"
        style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}
      >
        {label} <span style={{ color: "#ef4444" }}>*</span>
      </label>
      <div className="relative">
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
          style={{ color: focused ? hex : isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)" }}
        >
          <HiLockClosed className="w-4 h-4" />
        </div>
        <input
          type={show ? "text" : "password"}
          required
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-11 pr-12 py-3 rounded-xl text-sm transition-all duration-200 outline-none"
          style={{
            background: focused
              ? isDark
                ? `rgba(${rgb},.09)`
                : `rgba(${rgb},.05)`
              : isDark
                ? "rgba(255,255,255,.05)"
                : "rgba(0,0,0,.03)",
            border: `1px solid ${focused ? hex : isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
            boxShadow: focused ? `0 0 0 3px rgba(${rgb},.12)` : "none",
            color: isDark ? "white" : "black",
          }}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
          style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)" }}
        >
          {show ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
        </button>
      </div>
      {hint && (
        <p className="text-xs mt-1.5" style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Modal Component ───────────────────────────────────────
function FeedbackModal({ show, type, message, onClose, onSuccess, currentColor, isDark }) {
  const isSuccess = type === "success";
  const hex = currentColor || "#A855F7";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,.55)" }}
            onClick={isSuccess ? onSuccess : onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: "spring", damping: 20, stiffness: 280 }}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden z-10"
            style={{
              background: isDark ? "#111827" : "#fff",
              border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
              boxShadow: "0 24px 64px rgba(0,0,0,.4)",
            }}
          >
            {/* Top bar */}
            <div
              className="h-1 w-full"
              style={{ background: isSuccess ? "#10b981" : "#ef4444" }}
            />

            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{
                  background: isSuccess
                    ? "rgba(16,185,129,.12)"
                    : "rgba(239,68,68,.12)",
                }}
              >
                {isSuccess ? (
                  <HiCheckCircle className="w-9 h-9" style={{ color: "#10b981" }} />
                ) : (
                  <HiXCircle className="w-9 h-9" style={{ color: "#ef4444" }} />
                )}
              </motion.div>

              <h3
                className="text-xl font-bold mb-2"
                style={{ color: isDark ? "white" : "#111827" }}
              >
                {isSuccess ? "Berhasil!" : "Gagal"}
              </h3>
              <p
                className="text-sm leading-relaxed mb-7"
                style={{ color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}
              >
                {message}
              </p>

              <button
                onClick={isSuccess ? onSuccess : onClose}
                className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: isSuccess ? "#10b981" : hex,
                  boxShadow: isSuccess
                    ? "0 4px 14px rgba(16,185,129,.35)"
                    : `0 4px 14px rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},.35)`,
                }}
              >
                {isSuccess ? "Kembali ke Dashboard" : "Coba Lagi"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ────────────────────────────────────────
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confNewPassword, setConfNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const { currentColor, currentMode } = useStateContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isDark = currentMode === "Dark";
  const hex = currentColor || "#A855F7";
  const rgb = [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ].join(",");

  const strength = getStrength(newPassword);
  const match = newPassword && confNewPassword && newPassword === confNewPassword;
  const mismatch = confNewPassword && newPassword !== confNewPassword;

  useEffect(() => { dispatch(getMe()); }, [dispatch]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confNewPassword) {
      setMsg("Konfirmasi password tidak cocok");
      setModalType("error");
      setShowModal(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.patch(
        `${apiUrl}/change-password`,
        { oldPassword, newPassword, confNewPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOldPassword(""); setNewPassword(""); setConfNewPassword("");
      setMsg(response.data.msg || "Password berhasil diubah!");
      setModalType("success");
      setShowModal(true);
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Terjadi kesalahan";
      setMsg(errorMessage);
      setModalType(errorMessage.includes("lama") ? "invalid" : "error");
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-300"
      style={{ background: isDark ? "#040c24" : "#f8fafc" }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? "rgba(56,139,255,.06)" : "rgba(148,163,184,.06)"} 0.4px, transparent 0.5px),
            linear-gradient(90deg, ${isDark ? "rgba(56,139,255,.06)" : "rgba(148,163,184,.06)"} 0.4px, transparent 0.5px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating orbs */}
      <div className="fixed rounded-full pointer-events-none z-0" style={{
        width: 380, height: 380, filter: "blur(80px)", top: -100, left: -80,
        background: isDark ? `rgba(${rgb},.25)` : `rgba(${rgb},.12)`,
      }} />
      <div className="fixed rounded-full pointer-events-none z-0" style={{
        width: 300, height: 300, filter: "blur(80px)", bottom: -60, right: -50,
        background: isDark ? `rgba(${rgb},.28)` : `rgba(${rgb},.15)`,
      }} />

      {/* Content */}
      <div className="relative container mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start gap-4 mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="mt-1 p-2 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
            style={{ background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)" }}
          >
            <HiArrowLeft className="w-5 h-5" style={{ color: hex }} />
          </button>
          <div>
            <h1
              className="text-2xl font-bold tracking-wide"
              style={{ color: isDark ? "white" : "#111827" }}
            >
              Ganti <span style={{ color: hex }}>Password</span>
            </h1>
            <p className="text-xs mt-1" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.45)" }}>
              Perbarui kredensial akun Anda — Kantor Imigrasi Kelas II TPI Lhokseumawe
            </p>
          </div>
        </motion.div>

        {/* ── Form Card ── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: isDark ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.9)",
              border: `1px solid ${isDark ? "rgba(56,139,255,.18)" : "rgba(0,0,0,.1)"}`,
              backdropFilter: "blur(16px)",
              boxShadow: isDark ? "0 8px 32px rgba(0,0,0,.4)" : "0 4px 20px rgba(0,0,0,.06)",
            }}
          >
            {/* Top accent */}
            <div className="h-px" style={{
              background: isDark
                ? `linear-gradient(90deg,transparent,rgba(${rgb},.5),transparent)`
                : `linear-gradient(90deg,transparent,rgba(${rgb},.4),transparent)`,
            }} />

            <div className="p-8">

              {/* ── Section: Keamanan Akun ── */}
              <div className="mb-6 pb-4 border-b" style={{ borderColor: isDark ? "rgba(56,139,255,.2)" : `rgba(${rgb},.15)` }}>
                <h2 className="text-lg font-bold flex items-center gap-2.5" style={{ color: hex }}>
                  <HiShieldCheck className="w-6 h-6" />
                  Keamanan Akun
                </h2>
                <p className="text-xs mt-1" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.45)" }}>
                  Pastikan password baru minimal 8 karakter dan mengandung huruf besar, angka, atau simbol
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {/* Old Password */}
                <PasswordField
                  label="Password Lama"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder="Masukkan password lama Anda"
                  show={showOldPassword}
                  onToggle={() => setShowOldPassword(v => !v)}
                  currentColor={hex}
                  isDark={isDark}
                />

                {/* Divider */}
                <div className="relative flex items-center gap-3 my-1">
                  <div className="flex-1 h-px" style={{ background: isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.07)" }} />
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
                    color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)",
                    background: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)",
                  }}>Password Baru</span>
                  <div className="flex-1 h-px" style={{ background: isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.07)" }} />
                </div>

                {/* New Password */}
                <div>
                  <PasswordField
                    label="Password Baru"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Buat password baru yang kuat"
                    show={showNewPassword}
                    onToggle={() => setShowNewPassword(v => !v)}
                    currentColor={hex}
                    isDark={isDark}
                  />

                  {/* Strength bar */}
                  {newPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3"
                    >
                      <div className="flex gap-1.5 mb-1.5">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className="h-1.5 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background: strength.score >= i ? strength.color : isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)",
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-semibold" style={{ color: strength.color }}>
                        Kekuatan: {strength.label}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <PasswordField
                    label="Konfirmasi Password Baru"
                    value={confNewPassword}
                    onChange={e => setConfNewPassword(e.target.value)}
                    placeholder="Ulangi password baru Anda"
                    show={showConfPassword}
                    onToggle={() => setShowConfPassword(v => !v)}
                    currentColor={hex}
                    isDark={isDark}
                  />

                  {/* Match indicator */}
                  <AnimatePresence>
                    {confNewPassword && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 mt-2"
                      >
                        {match ? (
                          <>
                            <HiCheckCircle className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
                            <span className="text-xs font-medium" style={{ color: "#10b981" }}>Password cocok</span>
                          </>
                        ) : (
                          <>
                            <HiXCircle className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
                            <span className="text-xs font-medium" style={{ color: "#ef4444" }}>Password tidak cocok</span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tips box */}
                <div
                  className="rounded-xl p-4 flex gap-3"
                  style={{
                    background: isDark ? `rgba(${rgb},.07)` : `rgba(${rgb},.06)`,
                    border: `1px solid rgba(${rgb},.15)`,
                  }}
                >
                  <span className="text-lg flex-shrink-0">💡</span>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: hex }}>Tips Password Aman</p>
                    <ul className="text-xs space-y-0.5" style={{ color: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)" }}>
                      <li>• Minimal 8 karakter</li>
                      <li>• Kombinasi huruf besar, kecil, dan angka</li>
                      <li>• Tambahkan simbol (!@#$) untuk lebih kuat</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="h-px" style={{
              background: isDark
                ? `linear-gradient(90deg,transparent,rgba(${rgb},.3),transparent)`
                : `linear-gradient(90deg,transparent,rgba(${rgb},.25),transparent)`,
            }} />

            {/* Footer actions */}
            <div
              className="px-8 py-5 flex items-center justify-center gap-4"
              style={{
                background: isDark ? "rgba(255,255,255,.01)" : "rgba(0,0,0,.01)",
                borderTop: `1px solid ${isDark ? "rgba(56,139,255,.1)" : "rgba(0,0,0,.05)"}`,
              }}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)",
                  color: isDark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.6)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                }}
              >
                Batal
              </button>

              <motion.button
                type="submit"
                disabled={isSubmitting || mismatch || !oldPassword || !newPassword || !confNewPassword}
                whileHover={!isSubmitting ? { scale: 1.03, y: -1 } : {}}
                whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: hex,
                  boxShadow: `0 4px 18px rgba(${rgb},.38)`,
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: "rgba(255,255,255,.25)", borderTopColor: "white" }}
                    />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <HiShieldCheck className="w-4 h-4" />
                    Simpan Password
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>

      {/* ── Feedback Modal ── */}
      <FeedbackModal
        show={showModal}
        type={modalType}
        message={msg}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); navigate("/dashboard"); }}
        currentColor={hex}
        isDark={isDark}
      />
    </div>
  );
};

export default ChangePassword;