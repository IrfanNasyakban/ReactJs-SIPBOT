import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import { BsPersonFill } from "react-icons/bs";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

// ── Step Trail Data ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1,  label: "Data Pegawai",     status: "done"    },
  { id: 2,  label: "Data Kepegawaian", status: "done"    },
  { id: 3,  label: "Data Pangkat",     status: "done"    },
  { id: 4,  label: "Data Alamat",      status: "current" },
  { id: 5,  label: "Data Identitas",   status: "pending" },
  { id: 6,  label: "Data Rekening",    status: "pending" },
  { id: 7,  label: "Data Pendidikan",  status: "pending" },
  { id: 8,  label: "Data Fisik",       status: "pending" },
  { id: 9,  label: "Data Ukuran",      status: "pending" },
  { id: 10, label: "Data Keluarga",    status: "pending" },
];

const CURRENT_STEP = 4;

// ── StepTrail Component ──────────────────────────────────────────────────────
const StepTrail = ({ currentColor, isDark }) => {
  const rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };
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
                      background: isDone ? currentColor : isCurrent ? isDark ? `rgba(${c},.18)` : `rgba(${c},.12)` : isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)",
                      border: isDone || isCurrent ? `2px solid ${currentColor}` : `2px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                      boxShadow: isCurrent ? `0 0 0 4px rgba(${c},.15), 0 4px 12px rgba(${c},.25)` : isDone ? `0 2px 8px rgba(${c},.35)` : "none",
                    }}
                  >
                    {isDone ? (
                      <HiCheck className="w-4 h-4 text-white font-bold" />
                    ) : (
                      <span className="text-xs font-bold" style={{ color: isCurrent ? currentColor : isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)" }}>
                        {step.id}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full animate-ping" style={{ background: `rgba(${c},.25)`, animationDuration: "2s" }} />
                    )}
                  </div>
                  <span
                    className="text-center mt-2 leading-tight transition-colors duration-200"
                    style={{
                      fontSize: 10.5, maxWidth: 68,
                      color: isDone || isCurrent ? currentColor : isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.35)",
                      fontWeight: isCurrent ? 700 : isDone ? 600 : 400,
                    }}
                  >
                    {step.label}
                  </span>
                </div>

                {!isLast && (
                  <div className="flex-1 relative mt-[18px] mx-1" style={{ minWidth: 16 }}>
                    <div className="h-0.5 w-full rounded-full" style={{ background: isDone ? currentColor : isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)", opacity: isDone ? 0.7 : 1 }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)"}` }}>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)" }}>
            Langkah <span className="font-semibold" style={{ color: currentColor }}>{CURRENT_STEP}</span> dari <span className="font-semibold" style={{ color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.6)" }}>{STEPS.length}</span>
          </p>
          <div className="flex items-center gap-2">
            {[{ color: currentColor, label: "Selesai / Aktif" }, { color: isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.15)", label: "Belum" }].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.35)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const AddAlamatNext = () => {
  const [alamatKTP, setAlamatKTP] = useState("");
  const [alamatDomisili, setAlamatDomisili] = useState("");
  const [alamatSamaDenganKTP, setAlamatSamaDenganKTP] = useState(false);

  const [idPegawai, setIdPegawai] = useState("");
  const [namaPegawai, setNamaPegawai] = useState("");

  const [loading, setLoading] = useState(false);
  const { currentColor, currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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

  const saveAlamat = async (e) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = { idPegawai, alamatKTP, alamatDomisili };
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post("http://localhost:5000/alamat", jsonData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      console.log("Response dari Server:", response);
      setLoading(false);
      navigate("/next/add/identitas", { state: { idPegawai, namaPegawai } });
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("Terjadi kesalahan: " + (error.response?.data?.message || error.message));
    }
  };

  const rgb = (hex) => `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;

  const inputBase = {
    background: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.03)",
    border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
    color: isDark ? "white" : "black",
  };

  const onFocus = (e) => {
    e.target.style.borderColor = currentColor;
    e.target.style.background = isDark ? `rgba(${rgb(currentColor)},.08)` : `rgba(${rgb(currentColor)},.05)`;
  };

  const onBlur = (e) => {
    e.target.style.borderColor = isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)";
    e.target.style.background = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.03)";
  };

  const sectionBorder = { borderColor: isDark ? "rgba(56,139,255,.2)" : `rgba(${rgb(currentColor)},.2)` };
  const labelStyle = { color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" };

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
      <div className="fixed rounded-full pointer-events-none z-0" style={{ width: 380, height: 380, filter: "blur(80px)", background: isDark ? `rgba(${rgb(currentColor)},.28)` : `rgba(${rgb(currentColor)},.15)`, top: -100, left: -80 }} />
      <div className="fixed rounded-full pointer-events-none z-0" style={{ width: 340, height: 340, filter: "blur(80px)", background: isDark ? `rgba(${rgb(currentColor)},.32)` : `rgba(${rgb(currentColor)},.18)`, bottom: -80, right: -60 }} />

      {/* Content */}
      <div className="relative z-10 p-7">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate("/pegawai")}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)" }}
              >
                <HiArrowLeft className="w-5 h-5" style={{ color: currentColor }} />
              </button>
              <h1 className={`text-2xl font-bold tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>
                Tambah Data <span style={{ color: currentColor }}>Alamat</span>
              </h1>
            </div>
            <p className="text-xs ml-11 mt-1" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}>
              Formulir Penambahan Data Alamat Baru - Kantor Imigrasi Kelas II TPI Lhokseumawe
            </p>
          </div>
        </div>

        {/* Step Trail */}
        <StepTrail currentColor={currentColor} isDark={isDark} />

        {/* Form Card */}
        <form onSubmit={saveAlamat}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
              border: `1px solid ${isDark ? "rgba(56,139,255,.18)" : "rgba(0,0,0,.1)"}`,
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="h-px pointer-events-none" style={{ background: isDark ? "linear-gradient(90deg,transparent,rgba(56,139,255,.5),transparent)" : `linear-gradient(90deg,transparent,${currentColor}80,transparent)` }} />

            <div className="p-8">

              {/* Section 0: Data Pegawai */}
              <div className="mb-8">
                <div className="pb-4 border-b" style={sectionBorder}>
                  <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: currentColor }}>
                    <BsPersonFill className="w-8 h-8 dark:text-white" />
                    Data Pegawai
                  </h2>
                  <p className="text-xs mt-1" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}>
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

              {/* Section 1: Data Alamat Lengkap */}
              <div className="mb-8">
                <div className="pb-4 border-b" style={sectionBorder}>
                  <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: currentColor }}>
                    <BsPersonFill className="w-8 h-8 dark:text-white" />
                    Data Alamat Lengkap
                  </h2>
                </div>

                <div className="space-y-5 mt-6">
                  {/* Alamat KTP */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={labelStyle}>
                      Alamat Sesuai KTP <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <textarea
                      name="alamatKTP"
                      required
                      rows={4}
                      placeholder={`Masukkan alamat lengkap sesuai KTP\nContoh: Jl. Merdeka No. 123, RT 01/RW 02, Kelurahan Kampung Jawa, Kecamatan Banda Sakti, Kota Lhokseumawe, Aceh 24352`}
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 resize-none"
                      style={inputBase}
                      value={alamatKTP}
                      onChange={(e) => setAlamatKTP(e.target.value)}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>

                  {/* Toggle: Sama dengan KTP */}
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !alamatSamaDenganKTP;
                        setAlamatSamaDenganKTP(next);
                        setAlamatDomisili(next ? alamatKTP : "");
                      }}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                      style={{
                        background: alamatSamaDenganKTP ? currentColor : isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.04)",
                        border: `1.5px solid ${alamatSamaDenganKTP ? currentColor : isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.1)"}`,
                        color: alamatSamaDenganKTP ? "white" : isDark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.6)",
                        boxShadow: alamatSamaDenganKTP ? `0 4px 14px rgba(${rgb(currentColor)},.3)` : "none",
                      }}
                    >
                      {/* Custom checkbox */}
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200 flex-shrink-0"
                        style={{
                          background: alamatSamaDenganKTP ? "rgba(255,255,255,.25)" : "transparent",
                          border: `1.5px solid ${alamatSamaDenganKTP ? "rgba(255,255,255,.6)" : isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.25)"}`,
                        }}
                      >
                        {alamatSamaDenganKTP && <HiCheck className="w-3 h-3 text-white" />}
                      </div>
                      <span>📋</span>
                      <span>Alamat Domisili sama dengan Alamat KTP</span>
                    </button>
                  </div>

                  {/* Alamat Domisili */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={labelStyle}>
                      Alamat Domisili (Tempat Tinggal Saat ini) <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <textarea
                      name="alamatDomisili"
                      required
                      rows={4}
                      placeholder={`Masukkan alamat domisili saat ini\nContoh: Jl. Medan-Banda Aceh No. 45, RT 03/RW 04, Desa Muara Dua, Kecamatan Lhokseumawe Utara, Kota Lhokseumawe, Aceh 24356`}
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 resize-none"
                      style={{
                        ...inputBase,
                        opacity: alamatSamaDenganKTP ? 0.7 : 1,
                      }}
                      value={alamatDomisili}
                      onChange={(e) => setAlamatDomisili(e.target.value)}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      readOnly={alamatSamaDenganKTP}
                    />
                    {alamatSamaDenganKTP && (
                      <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: currentColor }}>
                        <HiCheck className="w-3 h-3" />
                        Otomatis diisi dari Alamat KTP
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
                onClick={() => navigate("/pegawai")}
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-88 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: currentColor, boxShadow: `0 4px 18px ${currentColor}4d` }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,255,255,.2)", borderTopColor: "white" }} />
                    Menyimpan...
                  </>
                ) : (
                  <>Simpan & Selanjutnya</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAlamatNext;