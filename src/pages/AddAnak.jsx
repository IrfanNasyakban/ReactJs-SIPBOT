import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";

import { BsPersonFill } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";
import { FiUsers, FiUser, FiInfo, FiHash } from "react-icons/fi";

const AddAnak = () => {
  const [jumlahAnak, setJumlahAnak] = useState("");
  const [namaAnak, setNamaAnak] = useState([]); // array of strings

  const [idPegawai, setIdPegawai] = useState("");
  const [pegawai, setPegawai] = useState([]);

  const [loading, setLoading] = useState(false);
  const { currentColor, currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Parse currentColor hex to rgb parts
  const hexToRgb = (hex) => {
    const h = hex.replace("#", "");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  };
  const rgb = hexToRgb(currentColor);
  const colorRgb = `${rgb.r},${rgb.g},${rgb.b}`;

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getPegawai();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getPegawai = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const pegawaiResponse = await axios.get(`${apiUrl}/pegawai`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPegawai(pegawaiResponse.data || []);
    } catch (err) {
      console.error("Error fetching pegawai:", err);
      setPegawai([]);
    } finally {
      setLoading(false);
    }
  };

  // When jumlahAnak changes, resize namaAnak array
  const handleJumlahChange = (e) => {
    const val = e.target.value;
    // Allow empty string
    if (val === "") {
      setJumlahAnak("");
      setNamaAnak([]);
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) return;
    setJumlahAnak(num);
    setNamaAnak((prev) => {
      const arr = [...prev];
      if (num > arr.length) {
        return [...arr, ...Array(num - arr.length).fill("")];
      }
      return arr.slice(0, num);
    });
  };

  const handleNamaChange = (index, value) => {
    setNamaAnak((prev) => {
      const arr = [...prev];
      arr[index] = value;
      return arr;
    });
  };

  const saveAnak = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      if (jumlahAnak === 0 || jumlahAnak === "") {
        // Save with namaAnak = "-"
        await axios.post(
          "http://localhost:5000/anak",
          { idPegawai, namaAnak: "-" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Save each child
        for (const nama of namaAnak) {
          await axios.post(
            "http://localhost:5000/anak",
            { idPegawai, namaAnak: nama },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      setLoading(false);
      navigate("/anak");
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("Terjadi kesalahan: " + (error.response?.data?.message || error.message));
    }
  };

  const inputBase = {
    background: isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.03)",
    border: `1.5px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
    color: isDark ? "white" : "#111",
    outline: "none",
    width: "100%",
    padding: "10px 14px 10px 42px",
    borderRadius: "12px",
    fontSize: "0.875rem",
    transition: "border-color .2s, background .2s, box-shadow .2s",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = currentColor;
    e.target.style.boxShadow = `0 0 0 3px rgba(${colorRgb},.15)`;
    e.target.style.background = isDark
      ? `rgba(${colorRgb},.1)`
      : `rgba(${colorRgb},.04)`;
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)";
    e.target.style.boxShadow = "none";
    e.target.style.background = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.03)";
  };

  const showChildFields = jumlahAnak !== "" && parseInt(jumlahAnak, 10) > 0;
  const childCount = showChildFields ? parseInt(jumlahAnak, 10) : 0;

  return (
    <div
      className={`min-h-screen overflow-hidden font-sans transition-colors duration-300 ${
        isDark ? "bg-[#040c24]" : "bg-gray-50"
      }`}
    >
      {/* Background Grid */}
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

      {/* Floating Orbs */}
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{
          width: 380, height: 380,
          filter: "blur(80px)",
          background: isDark ? `rgba(${colorRgb},.28)` : `rgba(${colorRgb},.15)`,
          top: -100, left: -80,
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{
          width: 340, height: 340,
          filter: "blur(80px)",
          background: isDark ? `rgba(${colorRgb},.32)` : `rgba(${colorRgb},.18)`,
          bottom: -80, right: -60,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-7">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate("/anak")}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)" }}
              >
                <HiArrowLeft className="w-5 h-5" style={{ color: currentColor }} />
              </button>
              <h1 className={`text-2xl font-bold tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>
                Tambah Data <span style={{ color: currentColor }}>Anak</span>
              </h1>
            </div>
            <p
              className="text-xs ml-11 mt-1"
              style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}
            >
              Formulir Penambahan Data Anak Pegawai - Kantor Imigrasi Kelas II TPI Lhokseumawe
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={saveAnak}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
              border: `1px solid ${isDark ? "rgba(56,139,255,.18)" : "rgba(0,0,0,.1)"}`,
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Top Highlight */}
            <div
              className="h-px pointer-events-none"
              style={{
                background: isDark
                  ? "linear-gradient(90deg,transparent,rgba(56,139,255,.5),transparent)"
                  : `linear-gradient(90deg,transparent,${currentColor}80,transparent)`,
              }}
            />

            <div className="p-8 space-y-8">

              {/* ── Section: Pilih Pegawai ── */}
              <div>
                <SectionHeader
                  icon={<BsPersonFill className="w-5 h-5" />}
                  title="Pilih Pegawai"
                  subtitle="Pilih nama pegawai yang bersangkutan"
                  currentColor={currentColor}
                  isDark={isDark}
                  colorRgb={colorRgb}
                />
                <div className="mt-6">
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                    Nama Pegawai <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div className="relative">
                    <BsPersonFill
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)" }}
                    />
                    <select
                      required
                      style={{ ...inputBase, appearance: "none" }}
                      value={idPegawai}
                      onChange={(e) => setIdPegawai(e.target.value)}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      disabled={pegawai.length === 0}
                    >
                      <option value="" disabled style={{ color: "black" }}>
                        {pegawai.length > 0 ? "-- Pilih Nama Pegawai --" : "Tidak ada pegawai tersedia"}
                      </option>
                      {pegawai.map((item) => (
                        <option key={item.id} value={item.id} style={{ color: "black" }}>
                          {item.namaDenganGelar || item.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Section: Jumlah Anak ── */}
              <div>
                <SectionHeader
                  icon={<FiUsers className="w-5 h-5" />}
                  title="Data Anak"
                  subtitle="Masukkan jumlah anak, lalu isi nama masing-masing anak"
                  currentColor={currentColor}
                  isDark={isDark}
                  colorRgb={colorRgb}
                />

                {/* Info Banner */}
                <div
                  className="flex items-start gap-3 mt-5 px-4 py-3 rounded-xl"
                  style={{
                    background: isDark ? `rgba(${colorRgb},.1)` : `rgba(${colorRgb},.07)`,
                    border: `1px solid rgba(${colorRgb},.25)`,
                  }}
                >
                  <FiInfo className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: currentColor }} />
                  <p className="text-xs leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.6)" }}>
                    <span className="font-semibold" style={{ color: currentColor }}>Catatan: </span>
                    Jika pegawai tidak memiliki anak, silakan isi jumlah anak dengan{" "}
                    <span className="font-bold" style={{ color: currentColor }}>0 (nol)</span>.
                  </p>
                </div>

                {/* Jumlah Anak Input */}
                <div className="mt-5">
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                    Jumlah Anak <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div className="relative max-w-xs">
                    <FiHash
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)" }}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      required
                      placeholder="0"
                      style={inputBase}
                      value={jumlahAnak}
                      onChange={handleJumlahChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <p className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.45)" }}>
                    <FiInfo className="w-3 h-3" />
                    Masukkan 0 jika tidak memiliki anak
                  </p>
                </div>

                {/* ── Dynamic Child Name Fields ── */}
                {showChildFields && (
                  <div className="mt-6">
                    {/* Sub-banner: berapa anak */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
                      style={{
                        background: isDark ? `rgba(${colorRgb},.12)` : `rgba(${colorRgb},.08)`,
                        border: `1px solid rgba(${colorRgb},.3)`,
                      }}
                    >
                      <FiUsers className="w-4 h-4 flex-shrink-0" style={{ color: currentColor }} />
                      <p className="text-sm font-semibold" style={{ color: currentColor }}>
                        Silakan isi nama-nama anak ({childCount} anak)
                      </p>
                    </div>

                    {/* Grid of name inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {Array.from({ length: childCount }).map((_, i) => (
                        <ChildNameInput
                          key={i}
                          index={i}
                          value={namaAnak[i] || ""}
                          onChange={(val) => handleNamaChange(i, val)}
                          isDark={isDark}
                          currentColor={currentColor}
                          colorRgb={colorRgb}
                          inputBase={inputBase}
                          handleFocus={handleFocus}
                          handleBlur={handleBlur}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* When jumlahAnak = 0 */}
                {jumlahAnak !== "" && parseInt(jumlahAnak, 10) === 0 && (
                  <div
                    className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      background: isDark ? "rgba(251,191,36,.08)" : "rgba(245,158,11,.06)",
                      border: "1px solid rgba(245,158,11,.3)",
                    }}
                  >
                    <span className="text-lg">ℹ️</span>
                    <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.6)" }}>
                      Pegawai ini tidak memiliki anak. Data akan disimpan dengan keterangan{" "}
                      <span className="font-bold" style={{ color: "#f59e0b" }}>"-"</span>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Highlight */}
            <div
              className="h-px pointer-events-none"
              style={{
                background: isDark
                  ? "linear-gradient(90deg,transparent,rgba(56,139,255,.3),transparent)"
                  : `linear-gradient(90deg,transparent,${currentColor}60,transparent)`,
              }}
            />

            {/* Footer Actions */}
            <div
              className="px-8 py-5 flex items-center justify-center gap-4"
              style={{
                background: isDark ? "rgba(255,255,255,.01)" : "rgba(0,0,0,.01)",
                borderTop: `1px solid ${isDark ? "rgba(56,139,255,.1)" : "rgba(0,0,0,.05)"}`,
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/anak")}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)",
                  color: isDark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.6)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: currentColor,
                  boxShadow: `0 4px 18px rgba(${colorRgb},.4)`,
                }}
              >
                {loading ? (
                  <>
                    <div
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "white" }}
                    />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Data
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Sub-components ── */

const SectionHeader = ({ icon, title, subtitle, currentColor, isDark, colorRgb }) => (
  <div
    className="pb-4 border-b"
    style={{
      borderColor: isDark ? "rgba(56,139,255,.2)" : `rgba(${colorRgb},.2)`,
    }}
  >
    <h2 className="text-base font-bold flex items-center gap-2" style={{ color: currentColor }}>
      {icon}
      {title}
    </h2>
    {subtitle && (
      <p className="text-xs mt-1 ml-7" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}>
        {subtitle}
      </p>
    )}
  </div>
);

const ChildNameInput = ({ index, value, onChange, isDark, currentColor, colorRgb, inputBase, handleFocus, handleBlur }) => (
  <div>
    <label
      className="block text-sm font-semibold mb-2 flex items-center gap-1.5"
      style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}
    >
      <FiUser className="w-3.5 h-3.5" style={{ color: currentColor }} />
      Nama Anak ke-{index + 1} <span style={{ color: "#ef4444" }}>*</span>
    </label>
    <div className="relative">
      <FiUser
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)" }}
      />
      <input
        type="text"
        required
        placeholder={`Masukkan nama lengkap anak ke-${index + 1}`}
        style={inputBase}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  </div>
);

export default AddAnak;