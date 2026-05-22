import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import { HiArrowLeft, HiCheck } from "react-icons/hi";
import { BsPersonFill, BsFillTelephoneFill } from "react-icons/bs";

// ── Step Trail Data ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Data Pegawai",      status: "done"    },
  { id: 2, label: "Data Kepegawaian",  status: "current" },
  { id: 3, label: "Data Pangkat",      status: "pending" },
  { id: 4, label: "Data Alamat",       status: "pending" },
  { id: 5, label: "Data Identitas",    status: "pending" },
  { id: 6, label: "Data Rekening",     status: "pending" },
  { id: 7, label: "Data Pendidikan",   status: "pending" },
  { id: 8, label: "Data Fisik",        status: "pending" },
  { id: 9, label: "Data Ukuran",       status: "pending" },
  { id: 10, label: "Data Keluarga",    status: "pending" },
];

// ── StepTrail Component ──────────────────────────────────────────────────────
const StepTrail = ({ currentColor, isDark }) => {
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };
  const rgb = hexToRgb(currentColor);

  return (
    <div
      className="w-full rounded-2xl mb-8 overflow-hidden"
      style={{
        background: isDark ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.95)",
        border: `1px solid ${isDark ? "rgba(56,139,255,.15)" : "rgba(0,0,0,.07)"}`,
        backdropFilter: "blur(16px)",
        boxShadow: isDark
          ? "0 4px 24px rgba(0,0,0,.3)"
          : "0 4px 24px rgba(0,0,0,.06)",
      }}
    >
      {/* Top progress bar */}
      <div
        className="h-1 w-full"
        style={{
          background: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)",
        }}
      >
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${((2) / STEPS.length) * 100}%`,
            background: `linear-gradient(90deg, ${currentColor}, rgba(${rgb},.6))`,
            borderRadius: "0 4px 4px 0",
          }}
        />
      </div>

      <div className="px-6 py-5">
        {/* Step list */}
        <div className="flex items-start gap-0 overflow-x-auto pb-1 scrollbar-hide">
          {STEPS.map((step, index) => {
            const isDone    = step.status === "done";
            const isCurrent = step.status === "current";
            const isPending = step.status === "pending";
            const isLast    = index === STEPS.length - 1;

            return (
              <React.Fragment key={step.id}>
                {/* Step item */}
                <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 72 }}>
                  {/* Circle */}
                  <div
                    className="relative flex items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      width: 36,
                      height: 36,
                      background: isDone
                        ? currentColor
                        : isCurrent
                        ? isDark
                          ? `rgba(${rgb},.18)`
                          : `rgba(${rgb},.12)`
                        : isDark
                        ? "rgba(255,255,255,.06)"
                        : "rgba(0,0,0,.04)",
                      border: isDone
                        ? `2px solid ${currentColor}`
                        : isCurrent
                        ? `2px solid ${currentColor}`
                        : `2px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                      boxShadow: isCurrent
                        ? `0 0 0 4px rgba(${rgb},.15), 0 4px 12px rgba(${rgb},.25)`
                        : isDone
                        ? `0 2px 8px rgba(${rgb},.35)`
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
                            : isDark
                            ? "rgba(255,255,255,.3)"
                            : "rgba(0,0,0,.3)",
                        }}
                      >
                        {step.id}
                      </span>
                    )}

                    {/* Pulse ring for current */}
                    {isCurrent && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{
                          background: `rgba(${rgb},.25)`,
                          animationDuration: "2s",
                        }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className="text-center mt-2 leading-tight font-medium transition-colors duration-200"
                    style={{
                      fontSize: 10.5,
                      maxWidth: 68,
                      color: isDone
                        ? currentColor
                        : isCurrent
                        ? currentColor
                        : isDark
                        ? "rgba(255,255,255,.3)"
                        : "rgba(0,0,0,.35)",
                      fontWeight: isCurrent ? 700 : isDone ? 600 : 400,
                    }}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div
                    className="flex-1 relative mt-[18px] mx-1"
                    style={{ minWidth: 16 }}
                  >
                    <div
                      className="h-0.5 w-full rounded-full"
                      style={{
                        background: isDone
                          ? currentColor
                          : isDark
                          ? "rgba(255,255,255,.08)"
                          : "rgba(0,0,0,.08)",
                        opacity: isDone ? 0.7 : 1,
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom meta info */}
        <div
          className="flex items-center justify-between mt-4 pt-3"
          style={{
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)"}`,
          }}
        >
          <p
            className="text-xs"
            style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)" }}
          >
            Langkah{" "}
            <span className="font-semibold" style={{ color: currentColor }}>
              2
            </span>{" "}
            dari{" "}
            <span className="font-semibold" style={{ color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.6)" }}>
              10
            </span>
          </p>

          <div className="flex items-center gap-2">
            {/* Legend */}
            {[
              { color: currentColor, label: "Selesai / Aktif" },
              { color: isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.15)", label: "Belum" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: item.color }}
                />
                <span
                  className="text-xs"
                  style={{ color: isDark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.35)" }}
                >
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

// ── Main Component ───────────────────────────────────────────────────────────
const AddKepegawaianNext = () => {
  const [statusKepegawaian, setStatusKepegawaian] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [tmtJabatan, setTmtJabatan] = useState("");
  const [bagianKerja, setBagianKerja] = useState("");
  const [eselon, setEselon] = useState("");
  const [angkatanPejim, setAngkatanPejim] = useState("");
  const [ppns, setPpns] = useState("");
  const [tmtPensiun, setTmtPensiun] = useState("");

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

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log("berhasil");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const saveKepegawaian = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!idPegawai) {
      alert("ID Pegawai tidak ditemukan. Silakan tambahkan data pegawai terlebih dahulu.");
      setLoading(false);
      return;
    }

    const jsonData = {
      idPegawai: Number(idPegawai),
      statusKepegawaian,
      jabatan,
      tmtJabatan,
      bagianKerja,
      eselon,
      angkatanPejim,
      ppns,
      tmtPensiun,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.post(`${apiUrl}/kepegawaian`, jsonData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Response dari Server:", response);
      setLoading(false);
      navigate("/next/add/pangkat", {
        state: {
          idPegawai: idPegawai,
          namaPegawai: namaPegawai,
        },
      });
    } catch (error) {
      setLoading(false);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message,
      );
      alert(
        "Terjadi kesalahan: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // Shared input style helper
  const inputStyle = (isSelect = false) => ({
    background: isDark
      ? isSelect ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.05)"
      : "rgba(0,0,0,.03)",
    border: `1px solid ${isDark
      ? isSelect ? "rgba(255,255,255,.15)" : "rgba(255,255,255,.1)"
      : "rgba(0,0,0,.1)"}`,
    color: isDark ? "white" : "black",
  });

  const focusStyle = (e) => {
    const r = parseInt(currentColor.slice(1, 3), 16);
    const g = parseInt(currentColor.slice(3, 5), 16);
    const b = parseInt(currentColor.slice(5, 7), 16);
    e.target.style.borderColor = currentColor;
    e.target.style.background = isDark
      ? `rgba(${r},${g},${b},.1)`
      : `rgba(${r},${g},${b},.05)`;
  };

  const blurStyle = (e, isSelect = false) => {
    e.target.style.borderColor = isDark
      ? isSelect ? "rgba(255,255,255,.15)" : "rgba(255,255,255,.1)"
      : "rgba(0,0,0,.1)";
    e.target.style.background = isDark
      ? isSelect ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.05)"
      : "rgba(0,0,0,.03)";
  };

  const sectionBorder = {
    borderColor: isDark
      ? "rgba(56,139,255,.2)"
      : `rgba(${parseInt(currentColor.slice(1,3),16)},${parseInt(currentColor.slice(3,5),16)},${parseInt(currentColor.slice(5,7),16)},.2)`,
  };

  return (
    <div
      className={`min-h-screen overflow-hidden font-sans transition-colors duration-300 ${
        isDark ? "bg-[#040c24]" : "bg-gray-50"
      }`}
    >
      {/* ── Background Grid ── */}
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

      {/* ── Floating Orbs ── */}
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{
          width: 380, height: 380,
          filter: "blur(80px)",
          background: isDark
            ? `rgba(${parseInt(currentColor.slice(1,3),16)},${parseInt(currentColor.slice(3,5),16)},${parseInt(currentColor.slice(5,7),16)},.28)`
            : `rgba(${parseInt(currentColor.slice(1,3),16)},${parseInt(currentColor.slice(3,5),16)},${parseInt(currentColor.slice(5,7),16)},.15)`,
          top: -100, left: -80,
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{
          width: 340, height: 340,
          filter: "blur(80px)",
          background: isDark
            ? `rgba(${parseInt(currentColor.slice(1,3),16)},${parseInt(currentColor.slice(3,5),16)},${parseInt(currentColor.slice(5,7),16)},.32)`
            : `rgba(${parseInt(currentColor.slice(1,3),16)},${parseInt(currentColor.slice(3,5),16)},${parseInt(currentColor.slice(5,7),16)},.18)`,
          bottom: -80, right: -60,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 p-7">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate("/pegawai")}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)",
                }}
              >
                <HiArrowLeft className="w-5 h-5" style={{ color: currentColor }} />
              </button>
              <h1
                className={`text-2xl font-bold tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Tambah Data{" "}
                <span style={{ color: currentColor }}>Kepegawaian</span>
              </h1>
            </div>
            <p
              className="text-xs ml-11 mt-1"
              style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}
            >
              Formulir Penambahan Data Kepegawaian Baru - Kantor Imigrasi Kelas II TPI Lhokseumawe
            </p>
          </div>
        </div>

        {/* ── Step Trail ── */}
        <StepTrail currentColor={currentColor} isDark={isDark} />

        {/* ── Form Card ── */}
        <form onSubmit={saveKepegawaian}>
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

            <div className="p-8">

              {/* ── Section 0: Data Pegawai ── */}
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
                    <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                      Nama Pegawai
                    </label>
                    <p className="dark:text-white text-xl font-bold">{namaPegawai}</p>
                  </div>
                </div>
              </div>

              {/* ── Section 1: Status Kepegawaian ── */}
              <div className="mb-8">
                <div className="pb-4 border-b" style={sectionBorder}>
                  <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: currentColor }}>
                    <BsPersonFill className="w-8 h-8 dark:text-white" />
                    Status Kepegawaian
                  </h2>
                  <p className="text-xs mt-1" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}>
                    Informasi status kepegawaian
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* Status Kepegawaian */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                      Status Kepegawaian
                    </label>
                    <select
                      name="statusKepegawaian"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={inputStyle(true)}
                      value={statusKepegawaian === "" ? "" : statusKepegawaian.toString()}
                      onChange={(e) => setStatusKepegawaian(e.target.value)}
                      onFocus={focusStyle}
                      onBlur={(e) => blurStyle(e, true)}
                    >
                      <option value="" style={{ color: "black" }}>-- Pilih Status Kepegawaian --</option>
                      <option value="PPNS" style={{ color: "black" }}>PNS</option>
                      <option value="CPNS" style={{ color: "black" }}>CPNS</option>
                      <option value="PPPK" style={{ color: "black" }}>PPPK</option>
                      <option value="Out Sourcing" style={{ color: "black" }}>Out Sourcing</option>
                    </select>
                  </div>

                  {/* PPNS */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                      PPNS
                    </label>
                    <select
                      name="ppns"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={inputStyle(true)}
                      value={ppns === "" ? "" : ppns.toString()}
                      onChange={(e) => setPpns(e.target.value === "true")}
                      onFocus={focusStyle}
                      onBlur={(e) => blurStyle(e, true)}
                    >
                      <option value="" style={{ color: "black" }}>-- Pilih Status PPNS --</option>
                      <option value="true" style={{ color: "black" }}>YA</option>
                      <option value="false" style={{ color: "black" }}>TIDAK</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Data Jabatan ── */}
              <div className="mb-8">
                <div className="pb-4 border-b" style={sectionBorder}>
                  <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: currentColor }}>
                    <BsFillTelephoneFill className="w-7 h-7 dark:text-white" />
                    Data Jabatan
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* Jabatan */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                      Jabatan
                    </label>
                    <input
                      name="jabatan" type="text"
                      placeholder="Contoh: Kepala Seksi TIKKIM"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={inputStyle()}
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>

                  {/* TMT Jabatan */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                      TMT Jabatan
                    </label>
                    <input
                      name="tmtJabatan" type="date"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={inputStyle()}
                      value={tmtJabatan}
                      onChange={(e) => setTmtJabatan(e.target.value)}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>

                  {/* Bagian Kerja */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                      Bagian Kerja
                    </label>
                    <input
                      name="bagianKerja" type="text"
                      placeholder="Contoh: Seksi Lalu Lintas Keimigrasian"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={inputStyle()}
                      value={bagianKerja}
                      onChange={(e) => setBagianKerja(e.target.value)}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>

                  {/* Eselon */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                      Eselon
                    </label>
                    <select
                      name="eselon"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={inputStyle(true)}
                      value={eselon === "" ? "" : eselon.toString()}
                      onChange={(e) => setEselon(e.target.value)}
                      onFocus={focusStyle}
                      onBlur={(e) => blurStyle(e, true)}
                    >
                      <option value="" style={{ color: "black" }}>-- Pilih Eselon --</option>
                      <option value="Non Eselon" style={{ color: "black" }}>Non Eselon</option>
                      <option value="Eselon V" style={{ color: "black" }}>Eselon V</option>
                      <option value="Eselon IV/b" style={{ color: "black" }}>Eselon IV/b</option>
                      <option value="Eselon IV/a" style={{ color: "black" }}>Eselon IV/a</option>
                      <option value="Eselon III/b" style={{ color: "black" }}>Eselon III/b</option>
                      <option value="Eselon III/a" style={{ color: "black" }}>Eselon III/a</option>
                      <option value="Eselon II/b" style={{ color: "black" }}>Eselon II/b</option>
                      <option value="Eselon II/a" style={{ color: "black" }}>Eselon II/a</option>
                      <option value="Eselon I/b" style={{ color: "black" }}>Eselon I/b</option>
                      <option value="Eselon I/a" style={{ color: "black" }}>Eselon I/a</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Section 3: Data Pendidikan Keimigrasian & Pensiun ── */}
              <div className="mb-8">
                <div className="pb-4 border-b" style={sectionBorder}>
                  <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: currentColor }}>
                    <span className="text-xl">📋</span>
                    Data Pendidikan Keimigrasian & Pensiun
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* Angkatan PEJIM */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                      Angkatan PEJIM
                    </label>
                    <input
                      name="angkatanPejim" type="text"
                      placeholder="Contoh: Angkatan 15"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={inputStyle()}
                      value={angkatanPejim}
                      onChange={(e) => setAngkatanPejim(e.target.value)}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>

                  {/* TMT Pensiun */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}>
                      TMT Pensiun
                    </label>
                    <input
                      name="tmtPensiun" type="date"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={inputStyle()}
                      value={tmtPensiun}
                      onChange={(e) => setTmtPensiun(e.target.value)}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>
                </div>
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
              className="px-8 py-6 flex items-center justify-center gap-4"
              style={{
                background: isDark ? "rgba(255,255,255,.01)" : "rgba(0,0,0,.01)",
                borderTop: `1px solid ${isDark ? "rgba(56,139,255,.1)" : "rgba(0,0,0,.05)"}`,
              }}
            >
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-88 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: currentColor,
                  boxShadow: `0 4px 18px ${currentColor}4d`,
                }}
              >
                {loading ? (
                  <>
                    <div
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: "rgba(255,255,255,.2)", borderTopColor: "white" }}
                    />
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

export default AddKepegawaianNext;