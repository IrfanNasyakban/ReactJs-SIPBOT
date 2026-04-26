import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";

import { BsPersonFill } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";

const EditFisik = () => {
  const [tinggiBadan, setTinggiBadan] = useState("");
  const [beratBadan, setBeratBadan] = useState("");
  const [jenisRambut, setJenisRambut] = useState("");
  const [warnaRambut, setWarnaRambut] = useState("");
  const [bentukWajah, setBentukWajah] = useState("");
  const [warnaKulit, setWarnaKulit] = useState("");
  const [ciriKhusus, setCiriKhusus] = useState("");

  const [namaDenganGelar, setNamaDenganGelar] = useState("");
  const [nip, setNip] = useState("");
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const { currentColor, currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getFisikById();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getFisikById = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`http://localhost:5000/fisik/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTinggiBadan(response.data.tinggiBadan);
    setBeratBadan(response.data.beratBadan);
    setJenisRambut(response.data.jenisRambut);
    setWarnaRambut(response.data.warnaRambut);
    setBentukWajah(response.data.bentukWajah);
    setWarnaKulit(response.data.warnaKulit);
    setCiriKhusus(response.data.ciriKhusus);
    setNamaDenganGelar(response.data.pegawai.namaDenganGelar);
    setNip(response.data.pegawai.nip);
  };

  const updateFisik = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("tinggiBadan", tinggiBadan);
    formData.append("beratBadan", beratBadan);
    formData.append("jenisRambut", jenisRambut);
    formData.append("warnaRambut", warnaRambut);
    formData.append("bentukWajah", bentukWajah);
    formData.append("warnaKulit", warnaKulit);
    formData.append("ciriKhusus", ciriKhusus);

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`http://localhost:5000/fisik/${id}`, jsonData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      navigate("/fisik");
    } catch (error) {
      console.log(error);
    }
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
          width: 380,
          height: 380,
          filter: "blur(80px)",
          background: isDark
            ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.28)`
            : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.15)`,
          top: -100,
          left: -80,
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{
          width: 340,
          height: 340,
          filter: "blur(80px)",
          background: isDark
            ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.32)`
            : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.18)`,
          bottom: -80,
          right: -60,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 p-7">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate("/fisik")}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,.08)"
                    : "rgba(0,0,0,.05)",
                }}
              >
                <HiArrowLeft
                  className="w-5 h-5"
                  style={{ color: currentColor }}
                />
              </button>
              <h1
                className={`text-2xl font-bold tracking-wide ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Ubah Data <span style={{ color: currentColor }}>Fisik</span>
              </h1>
            </div>
            <p
              className="text-xs ml-11 mt-1"
              style={{
                color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)",
              }}
            >
              Formulir Pengubahan Data Ciri-Ciri Fisik Pegawai - Kantor Imigrasi
              Kelas II TPI Lhokseumawe
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={updateFisik}>
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
              {/* ── Section 0: Informasi Pegawai ── */}
              <div className="mb-8">
                <div
                  className="pb-4 border-b"
                  style={{
                    borderColor: isDark
                      ? "rgba(56,139,255,.2)"
                      : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.2)`,
                  }}
                >
                  <h2
                    className="text-lg font-bold flex items-center gap-2"
                    style={{ color: currentColor }}
                  >
                    <BsPersonFill className="w-8 h-8 dark:text-white" />
                    Informasi Pegawai
                  </h2>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: isDark
                        ? "rgba(255,255,255,.35)"
                        : "rgba(0,0,0,.5)",
                    }}
                  >
                    Nama Pegawai
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* Nama Lengkap */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Nama Lengkap
                    </label>
                    <div
                      className="w-full py-3 rounded-xl text-sm transition-all duration-200"
                      style={{
                        color: isDark ? "white" : "black",
                        minHeight: 48,
                      }}
                    >
                      <p className="text-base font-medium break-words">
                        {namaDenganGelar || "-"}
                      </p>
                    </div>
                  </div>

                  {/* NIP */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      NIP
                    </label>
                    <div
                      className="w-full py-3 rounded-xl text-sm transition-all duration-200"
                      style={{
                        color: isDark ? "white" : "black",
                        minHeight: 48,
                      }}
                    >
                      <p className="text-base font-medium break-words">
                        {nip || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 1: Ukuran Tubuh ── */}
              <div className="mb-8">
                <div
                  className="pb-4 border-b"
                  style={{
                    borderColor: isDark
                      ? "rgba(56,139,255,.2)"
                      : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.2)`,
                  }}
                >
                  <h2
                    className="text-lg font-bold flex items-center gap-2"
                    style={{ color: currentColor }}
                  >
                    <span className="text-xl">📏</span>
                    Ukuran Tubuh
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* Tinggi Badan */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Tinggi Badan (cm){" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      name="tinggiBadan"
                      type="number"
                      required
                      placeholder="Contoh: 170"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={tinggiBadan}
                      onChange={(e) => setTinggiBadan(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = currentColor;
                        e.target.style.background = isDark
                          ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`
                          : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.05)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDark
                          ? "rgba(255,255,255,.1)"
                          : "rgba(0,0,0,.1)";
                        e.target.style.background = isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)";
                      }}
                    />
                  </div>

                  {/* Berat Badan */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Berat Badan (kg){" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      name="beratBadan"
                      type="number"
                      required
                      placeholder="Contoh: 65"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={beratBadan}
                      onChange={(e) => setBeratBadan(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = currentColor;
                        e.target.style.background = isDark
                          ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`
                          : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.05)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDark
                          ? "rgba(255,255,255,.1)"
                          : "rgba(0,0,0,.1)";
                        e.target.style.background = isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Section 2: Ciri-Ciri Rambut ── */}
              <div className="mb-8">
                <div
                  className="pb-4 border-b"
                  style={{
                    borderColor: isDark
                      ? "rgba(56,139,255,.2)"
                      : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.2)`,
                  }}
                >
                  <h2
                    className="text-lg font-bold flex items-center gap-2"
                    style={{ color: currentColor }}
                  >
                    <span className="text-xl">💇</span>
                    Ciri-Ciri Rambut
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* Jenis Rambut */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Jenis Rambut <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      name="jenisRambut"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={jenisRambut}
                      onChange={(e) => setJenisRambut(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = currentColor;
                        e.target.style.background = isDark
                          ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`
                          : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.05)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDark
                          ? "rgba(255,255,255,.1)"
                          : "rgba(0,0,0,.1)";
                        e.target.style.background = isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)";
                      }}
                    >
                      <option value="">-- Pilih Jenis Rambut --</option>
                      <option value="lurus" style={{ color: "black" }}>
                        Lurus
                      </option>
                      <option value="bergelombang" style={{ color: "black" }}>
                        Bergelombang
                      </option>
                      <option value="keriting" style={{ color: "black" }}>
                        Keriting
                      </option>
                      <option value="ikal" style={{ color: "black" }}>
                        Ikal
                      </option>
                    </select>
                  </div>

                  {/* Warna Rambut */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Warna Rambut <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      name="warnaRambut"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={warnaRambut}
                      onChange={(e) => setWarnaRambut(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = currentColor;
                        e.target.style.background = isDark
                          ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`
                          : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.05)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDark
                          ? "rgba(255,255,255,.1)"
                          : "rgba(0,0,0,.1)";
                        e.target.style.background = isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)";
                      }}
                    >
                      <option value="">-- Pilih Warna Rambut --</option>
                      <option value="hitam" style={{ color: "black" }}>
                        Hitam
                      </option>
                      <option value="coklat" style={{ color: "black" }}>
                        Coklat
                      </option>
                      <option value="pirang" style={{ color: "black" }}>
                        Pirang
                      </option>
                      <option value="merah" style={{ color: "black" }}>
                        Merah
                      </option>
                      <option value="uban" style={{ color: "black" }}>
                        Uban
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Section 3: Ciri-Ciri Wajah & Kulit ── */}
              <div className="mb-8">
                <div
                  className="pb-4 border-b"
                  style={{
                    borderColor: isDark
                      ? "rgba(56,139,255,.2)"
                      : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.2)`,
                  }}
                >
                  <h2
                    className="text-lg font-bold flex items-center gap-2"
                    style={{ color: currentColor }}
                  >
                    <BsPersonFill className="w-8 h-8 dark:text-white" />
                    Ciri-Ciri Wajah & Kulit
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* Bentuk Wajah */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Bentuk Wajah <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      name="bentukWajah"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={bentukWajah}
                      onChange={(e) => setBentukWajah(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = currentColor;
                        e.target.style.background = isDark
                          ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`
                          : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.05)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDark
                          ? "rgba(255,255,255,.1)"
                          : "rgba(0,0,0,.1)";
                        e.target.style.background = isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)";
                      }}
                    >
                      <option value="">-- Pilih Bentuk Wajah --</option>
                      <option value="bulat" style={{ color: "black" }}>
                        Bulat
                      </option>
                      <option value="lonjong" style={{ color: "black" }}>
                        Lonjong
                      </option>
                      <option value="persegi" style={{ color: "black" }}>
                        Persegi
                      </option>
                      <option value="hati" style={{ color: "black" }}>
                        Hati
                      </option>
                      <option value="berlian" style={{ color: "black" }}>
                        Berlian
                      </option>
                    </select>
                  </div>

                  {/* Warna Kulit */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Warna Kulit <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      name="warnaKulit"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={warnaKulit}
                      onChange={(e) => setWarnaKulit(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = currentColor;
                        e.target.style.background = isDark
                          ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`
                          : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.05)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDark
                          ? "rgba(255,255,255,.1)"
                          : "rgba(0,0,0,.1)";
                        e.target.style.background = isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)";
                      }}
                    >
                      <option value="">-- Pilih Warna Kulit --</option>
                      <option value="putih" style={{ color: "black" }}>
                        Putih
                      </option>
                      <option value="kuning langsat" style={{ color: "black" }}>
                        Kuning Langsat
                      </option>
                      <option value="sawo matang" style={{ color: "black" }}>
                        Sawo Matang
                      </option>
                      <option value="coklat" style={{ color: "black" }}>
                        Coklat
                      </option>
                      <option value="hitam" style={{ color: "black" }}>
                        Hitam
                      </option>
                    </select>
                  </div>

                  {/* Ciri Khusus */}
                  <div className="col-span-2">
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Ciri Khusus
                    </label>
                    <textarea
                      name="ciriKhusus"
                      placeholder="Contoh: Tanda lahir di telinga kiri, bekas luka di dahi"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                        minHeight: "100px",
                      }}
                      value={ciriKhusus}
                      onChange={(e) => setCiriKhusus(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = currentColor;
                        e.target.style.background = isDark
                          ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`
                          : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.05)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDark
                          ? "rgba(255,255,255,.1)"
                          : "rgba(0,0,0,.1)";
                        e.target.style.background = isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)";
                      }}
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
                background: isDark
                  ? "rgba(255,255,255,.01)"
                  : "rgba(0,0,0,.01)",
                borderTop: `1px solid ${isDark ? "rgba(56,139,255,.1)" : "rgba(0,0,0,.05)"}`,
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/fisik")}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,.08)"
                    : "rgba(0,0,0,.05)",
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
                style={{
                  background: currentColor,
                  boxShadow: `0 4px 18px ${currentColor}4d`,
                }}
              >
                {loading ? (
                  <>
                    <div
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{
                        borderColor: "rgba(255,255,255,.2)",
                        borderTopColor: "white",
                      }}
                    />
                    Menyimpan...
                  </>
                ) : (
                  <>Simpan Perubahan</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFisik;
