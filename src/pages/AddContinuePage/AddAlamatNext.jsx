import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import { BsFillTelephoneFill, BsPersonFill } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";

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

  const saveAlamat = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jsonData = {
      idPegawai,
      alamatKTP,
      alamatDomisili,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:5000/alamat",
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Response dari Server:", response);
      setLoading(false);
      navigate("/next/add/identitas", {
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
                onClick={() => navigate("/pegawai")}
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
                Tambah Data <span style={{ color: currentColor }}>Alamat</span>
              </h1>
            </div>
            <p
              className="text-xs ml-11 mt-1"
              style={{
                color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)",
              }}
            >
              Formulir Penambahan Data Alamat Baru - Kantor Imigrasi Kelas II
              TPI Lhokseumawe
            </p>
          </div>
        </div>

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
                    Data Pegawai
                  </h2>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: isDark
                        ? "rgba(255,255,255,.35)"
                        : "rgba(0,0,0,.5)",
                    }}
                  >
                    Informasi pegawai yang baru ditambahkan
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* ID Pegawai (Hidden) */}
                  <input type="hidden" value={idPegawai} />

                  {/* Nama Pegawai (Read Only) */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Nama Pegawai <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <p className="dark:text-white text-xl font-bold">
                      {namaPegawai}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Section 1: Data Alamat Lengkap ── */}
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
                    Data Alamat Lengkap
                  </h2>
                </div>

                <div className="space-y-4 mt-6">
                  {/* Alamat Sesuai KTP */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Alamat Sesuai KTP{" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <textarea
                      name="alamatKTP"
                      type="textarea"
                      required
                      placeholder="Masukkan alamat lengkap sesuai KTP
    Contoh: Jl. Merdeka No. 123, RT 01/RW 02, Kelurahan Kampung Jawa, Kecamatan Banda Sakti, Kota Lhokseumawe, Aceh 24352"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={alamatKTP}
                      onChange={(e) => setAlamatKTP(e.target.value)}
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

                  {/* Button Alamat Domisili sama dengan Alamat KTP */}
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        setAlamatSamaDenganKTP(!alamatSamaDenganKTP);
                        if (!alamatSamaDenganKTP) {
                          setAlamatDomisili(alamatKTP);
                        } else {
                          setAlamatDomisili("");
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                      style={{
                        background: alamatSamaDenganKTP
                          ? currentColor
                          : isDark
                            ? "rgba(255,255,255,.08)"
                            : "rgba(0,0,0,.05)",
                        border: `1.5px solid ${alamatSamaDenganKTP ? currentColor : isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.1)"}`,
                        color: alamatSamaDenganKTP
                          ? "white"
                          : isDark
                            ? "rgba(255,255,255,.7)"
                            : "rgba(0,0,0,.6)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={alamatSamaDenganKTP}
                        onChange={() => {}}
                        className="hidden"
                      />
                      <span>📋</span>
                      <span>Alamat Domisili sama dengan Alamat KTP</span>
                    </button>
                  </div>

                  {/* Alamat Domisili (Tempat Tinggal Saat ini) */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Alamat Domisili (Tempat Tinggal Saat ini){" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <textarea
                      name="alamatDomisili"
                      type="textarea"
                      required
                      placeholder="Masukkan alamat domisili saat ini
    Contoh: Jl. Medan-Banda Aceh No. 45, RT 03/RW 04, Desa Muara Dua, Kecamatan Lhokseumawe Utara, Kota Lhokseumawe, Aceh 24356"
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={alamatDomisili}
                      onChange={(e) => setAlamatDomisili(e.target.value)}
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
                onClick={() => navigate("/pegawai")}
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
                  <>Simpan</>
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
