import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import { BsPersonFill } from "react-icons/bs";
import { HiArrowLeft, HiCheck } from "react-icons/hi";
import { FiUsers, FiUser, FiInfo, FiHash, FiHeart } from "react-icons/fi";

// ── Step Trail Data ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1,  label: "Data Pegawai",     status: "done"    },
  { id: 2,  label: "Data Kepegawaian", status: "done"    },
  { id: 3,  label: "Data Pangkat",     status: "done"    },
  { id: 4,  label: "Data Alamat",      status: "done"    },
  { id: 5,  label: "Data Identitas",   status: "done"    },
  { id: 6,  label: "Data Rekening",    status: "done"    },
  { id: 7,  label: "Data Pendidikan",  status: "done"    },
  { id: 8,  label: "Data Fisik",       status: "done"    },
  { id: 9,  label: "Data Ukuran",      status: "done"    },
  { id: 10, label: "Data Keluarga",    status: "current" },
];

const CURRENT_STEP = 10;

// ── StepTrail Component ──────────────────────────────────────────────────────
const StepTrail = ({ currentColor, isDark }) => {
  const rgb = (hex) =>
    `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
  const c = rgb(currentColor);

  return (
    <div
      className="w-full rounded-2xl mb-8 overflow-hidden"
      style={{
        background: isDark ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.95)",
        border: `1px solid ${isDark ? "rgba(56,139,255,.15)" : "rgba(0,0,0,.07)"}`,
        backdropFilter: "blur(16px)",
        boxShadow: isDark ? "0 4px 24px rgba(0,0,0,.3)" : "0 4px 24px rgba(0,0,0,.06)",
      }}
    >
      <div className="h-1 w-full" style={{ background: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)" }}>
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${(CURRENT_STEP / STEPS.length) * 100}%`,
            background: `linear-gradient(90deg, ${currentColor}, rgba(${c},.6))`,
            borderRadius: "0 4px 4px 0",
          }}
        />
      </div>

      <div className="px-6 py-5">
        <div className="flex items-start gap-0 overflow-x-auto pb-1">
          {STEPS.map((step, index) => {
            const isDone    = step.status === "done";
            const isCurrent = step.status === "current";
            const isLast    = index === STEPS.length - 1;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 72 }}>
                  <div
                    className="relative flex items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      width: 36, height: 36,
                      background: isDone
                        ? currentColor
                        : isCurrent
                        ? isDark ? `rgba(${c},.18)` : `rgba(${c},.12)`
                        : isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)",
                      border:
                        isDone || isCurrent
                          ? `2px solid ${currentColor}`
                          : `2px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                      boxShadow: isCurrent
                        ? `0 0 0 4px rgba(${c},.15), 0 4px 12px rgba(${c},.25)`
                        : isDone
                        ? `0 2px 8px rgba(${c},.35)`
                        : "none",
                    }}
                  >
                    {isDone ? (
                      <HiCheck className="w-4 h-4 text-white font-bold" />
                    ) : (
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: isCurrent
                            ? currentColor
                            : isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)",
                        }}
                      >
                        {step.id}
                      </span>
                    )}
                    {isCurrent && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{ background: `rgba(${c},.25)`, animationDuration: "2s" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-center mt-2 leading-tight transition-colors duration-200"
                    style={{
                      fontSize: 10.5,
                      maxWidth: 68,
                      color:
                        isDone || isCurrent
                          ? currentColor
                          : isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.35)",
                      fontWeight: isCurrent ? 700 : isDone ? 600 : 400,
                    }}
                  >
                    {step.label}
                  </span>
                </div>

                {!isLast && (
                  <div className="flex-1 relative mt-[18px] mx-1" style={{ minWidth: 16 }}>
                    <div
                      className="h-0.5 w-full rounded-full"
                      style={{
                        background: isDone
                          ? currentColor
                          : isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)",
                        opacity: isDone ? 0.7 : 1,
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div
          className="flex items-center justify-between mt-4 pt-3"
          style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)"}` }}
        >
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)" }}>
            Langkah{" "}
            <span className="font-semibold" style={{ color: currentColor }}>{CURRENT_STEP}</span> dari{" "}
            <span className="font-semibold" style={{ color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.6)" }}>
              {STEPS.length}
            </span>
          </p>
          <div className="flex items-center gap-3">
            {[
              { color: currentColor, label: "Selesai / Aktif" },
              { color: isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.15)", label: "Belum" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.35)" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Section Header Sub-component ─────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle, currentColor, isDark, colorRgb }) => (
  <div
    className="pb-4 border-b"
    style={{ borderColor: isDark ? "rgba(56,139,255,.2)" : `rgba(${colorRgb},.2)` }}
  >
    <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: currentColor }}>
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

// ── Main Component ────────────────────────────────────────────────────────────
const AddKeluargaNext = () => {
  // Pasangan
  const [namaPasangan, setNamaPasangan] = useState("");

  // Anak
  const [jumlahAnak, setJumlahAnak] = useState("");
  const [namaAnak, setNamaAnak] = useState([]);

  // Pegawai
  const [idPegawai, setIdPegawai] = useState("");
  const [namaPegawai, setNamaPegawai] = useState("");

  const [loading, setLoading] = useState(false);
  const { currentColor, currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Helpers
  const rgb = (hex) =>
    `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
  const colorRgb = rgb(currentColor);

  useEffect(() => {
    if (location.state) {
      setIdPegawai(location.state.idPegawai || "");
      setNamaPegawai(location.state.namaPegawai || "");
    }
  }, [location.state]);

  useEffect(() => { dispatch(getMe()); }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/");
  }, [navigate]);

  // ── Jumlah anak handler ──
  const handleJumlahChange = (e) => {
    const val = e.target.value;
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
      if (num > arr.length) return [...arr, ...Array(num - arr.length).fill("")];
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

  // ── Submit ──
  const saveKeluarga = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

      // 1. Save pasangan
      await axios.post(
        "http://localhost:5000/pasangan",
        { idPegawai, namaPasangan },
        { headers }
      );

      // 2. Save anak
      const jumlah = jumlahAnak === "" ? 0 : parseInt(jumlahAnak, 10);
      if (jumlah === 0) {
        await axios.post("http://localhost:5000/anak", { idPegawai, namaAnak: "-" }, { headers });
      } else {
        for (const nama of namaAnak) {
          await axios.post("http://localhost:5000/anak", { idPegawai, namaAnak: nama }, { headers });
        }
      }

      setLoading(false);
      navigate("/pegawai"); // end of flow
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("Terjadi kesalahan: " + (error.response?.data?.message || error.message));
    }
  };

  // ── Shared styles ──
  const inputBase = {
    background: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.03)",
    border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
    color: isDark ? "white" : "black",
  };

  const onFocus = (e) => {
    e.target.style.borderColor = currentColor;
    e.target.style.background = isDark
      ? `rgba(${colorRgb},.08)`
      : `rgba(${colorRgb},.05)`;
    e.target.style.boxShadow = `0 0 0 3px rgba(${colorRgb},.12)`;
  };

  const onBlur = (e) => {
    e.target.style.borderColor = isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)";
    e.target.style.background = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.03)";
    e.target.style.boxShadow = "none";
  };

  const sectionBorder = {
    borderColor: isDark ? "rgba(56,139,255,.2)" : `rgba(${colorRgb},.2)`,
  };

  const labelStyle = { color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" };

  const showChildFields = jumlahAnak !== "" && parseInt(jumlahAnak, 10) > 0;
  const childCount = showChildFields ? parseInt(jumlahAnak, 10) : 0;

  return (
    <div className={`min-h-screen overflow-hidden font-sans transition-colors duration-300 ${isDark ? "bg-[#040c24]" : "bg-gray-50"}`}>

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
      <div className="fixed rounded-full pointer-events-none z-0" style={{ width: 380, height: 380, filter: "blur(80px)", background: isDark ? `rgba(${colorRgb},.28)` : `rgba(${colorRgb},.15)`, top: -100, left: -80 }} />
      <div className="fixed rounded-full pointer-events-none z-0" style={{ width: 340, height: 340, filter: "blur(80px)", background: isDark ? `rgba(${colorRgb},.32)` : `rgba(${colorRgb},.18)`, bottom: -80, right: -60 }} />

      {/* Content */}
      <div className="relative z-10 p-7">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate("/keluarga")}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)" }}
              >
                <HiArrowLeft className="w-5 h-5" style={{ color: currentColor }} />
              </button>
              <h1 className={`text-2xl font-bold tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>
                Tambah Data <span style={{ color: currentColor }}>Keluarga</span>
              </h1>
            </div>
            <p className="text-xs ml-11 mt-1" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}>
              Formulir Penambahan Data Keluarga Pegawai - Kantor Imigrasi Kelas II TPI Lhokseumawe
            </p>
          </div>
        </div>

        {/* Step Trail */}
        <StepTrail currentColor={currentColor} isDark={isDark} />

        {/* Form Card */}
        <form onSubmit={saveKeluarga}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
              border: `1px solid ${isDark ? "rgba(56,139,255,.18)" : "rgba(0,0,0,.1)"}`,
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="h-px pointer-events-none" style={{ background: isDark ? "linear-gradient(90deg,transparent,rgba(56,139,255,.5),transparent)" : `linear-gradient(90deg,transparent,${currentColor}80,transparent)` }} />

            <div className="p-8 space-y-10">

              {/* ── Section 0: Data Pegawai ── */}
              <div>
                <div className="pb-4 border-b" style={sectionBorder}>
                  <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: currentColor }}>
                    <BsPersonFill className="w-5 h-5" />
                    Data Pegawai
                  </h2>
                  <p className="text-xs mt-1 ml-7" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}>
                    Informasi pegawai yang baru ditambahkan
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <input type="hidden" value={idPegawai} />
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={labelStyle}>
                      Nama Pegawai <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <p className="dark:text-white text-xl font-bold">{namaPegawai}</p>
                  </div>
                </div>
              </div>

              {/* ── Section 1: Data Pasangan ── */}
              <div>
                <SectionHeader
                  icon={<FiHeart className="w-5 h-5" />}
                  title="Data Pasangan (Suami/Istri)"
                  subtitle="Masukkan nama lengkap pasangan sesuai KTP"
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
                    <span className="font-semibold" style={{ color: currentColor }}>Informasi: </span>
                    Jika belum menikah atau tidak memiliki pasangan, silakan isi dengan tanda strip{" "}
                    <span className="font-bold" style={{ color: currentColor }}>(-)</span>.
                  </p>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-semibold mb-2" style={labelStyle}>
                    Nama Lengkap Pasangan <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div className="relative">
                    <FiUser
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)" }}
                    />
                    <input
                      name="namaPasangan"
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap pasangan atau (-) jika belum menikah"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={inputBase}
                      value={namaPasangan}
                      onChange={(e) => setNamaPasangan(e.target.value)}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                  <p className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.45)" }}>
                    <FiInfo className="w-3 h-3" />
                    Nama lengkap suami/istri sesuai KTP atau isi dengan (-) jika belum menikah
                  </p>
                </div>
              </div>

              {/* ── Section 2: Data Anak ── */}
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

                {/* Jumlah Anak */}
                <div className="mt-5">
                  <label className="block text-sm font-semibold mb-2" style={labelStyle}>
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={inputBase}
                      value={jumlahAnak}
                      onChange={handleJumlahChange}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                  <p className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.45)" }}>
                    <FiInfo className="w-3 h-3" />
                    Masukkan 0 jika tidak memiliki anak
                  </p>
                </div>

                {/* Dynamic child name fields */}
                {showChildFields && (
                  <div className="mt-6">
                    {/* Sub-banner */}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {Array.from({ length: childCount }).map((_, i) => (
                        <div key={i}>
                          <label
                            className="block text-sm font-semibold mb-2 flex items-center gap-1.5"
                            style={labelStyle}
                          >
                            <FiUser className="w-3.5 h-3.5" style={{ color: currentColor }} />
                            Nama Anak ke-{i + 1} <span style={{ color: "#ef4444" }}>*</span>
                          </label>
                          <div className="relative">
                            <FiUser
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                              style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)" }}
                            />
                            <input
                              type="text"
                              required
                              placeholder={`Masukkan nama lengkap anak ke-${i + 1}`}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                              style={inputBase}
                              value={namaAnak[i] || ""}
                              onChange={(e) => handleNamaChange(i, e.target.value)}
                              onFocus={onFocus}
                              onBlur={onBlur}
                            />
                          </div>
                        </div>
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

            </div>{/* end p-8 */}

            <div className="h-px pointer-events-none" style={{ background: isDark ? "linear-gradient(90deg,transparent,rgba(56,139,255,.3),transparent)" : `linear-gradient(90deg,transparent,${currentColor}60,transparent)` }} />

            {/* Footer Actions */}
            <div
              className="px-8 py-6 flex items-center justify-center gap-4"
              style={{
                background: isDark ? "rgba(255,255,255,.01)" : "rgba(0,0,0,.01)",
                borderTop: `1px solid ${isDark ? "rgba(56,139,255,.1)" : "rgba(0,0,0,.05)"}`,
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/keluarga")}
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
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${currentColor}, rgba(${colorRgb},.75))`,
                  boxShadow: `0 4px 18px rgba(${colorRgb},.4)`,
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,255,255,.2)", borderTopColor: "white" }} />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <HiCheck className="w-4 h-4" />
                    Selesai & Simpan Data
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

export default AddKeluargaNext;