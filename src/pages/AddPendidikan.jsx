import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";
import { HiArrowLeft } from "react-icons/hi";

const AddPendidikan = () => {
    const [pendidikanTerakhir, setPendidikanTerakhir] = useState("");

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
          console.log("berhasil");
        } else {
          navigate("/");
        }
      }, [navigate]);

  const savePendidikan = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const jsonData = {
      pendidikanTerakhir,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:5000/pendidikan",
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response dari Server:", response);
      setLoading(false);
      navigate("/pendidikan");
    } catch (error) {
      setLoading(false);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      alert("Terjadi kesalahan: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className={`min-h-screen overflow-hidden font-sans transition-colors duration-300 ${
                      isDark ? 'bg-[#040c24]' : 'bg-gray-50'
                    }`}>
                      {/* ── Background Grid ── */}
                      <div
                        className="fixed inset-0 pointer-events-none z-0"
                        style={{
                          backgroundImage: `
                            linear-gradient(${isDark ? 'rgba(56,139,255,.06)' : 'rgba(148,163,184,.06)'} 0.4px, transparent 0.5px),
                            linear-gradient(90deg, ${isDark ? 'rgba(56,139,255,.06)' : 'rgba(148,163,184,.06)'} 0.4px, transparent 0.5px)
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
                                  background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)",
                                }}
                              >
                                <HiArrowLeft
                                  className="w-5 h-5"
                                  style={{ color: currentColor }}
                                />
                              </button>
                              <h1 className={`text-2xl font-bold tracking-wide ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                Tambah Data <span style={{ color: currentColor }}>Pendidikan</span>
                              </h1>
                            </div>
                            <p
                              className="text-xs ml-11 mt-1"
                              style={{
                                color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)",
                              }}
                            >
                              Formulir Penambahan Data Pendidikan Baru - Kantor Imigrasi Kelas II TPI Lhokseumawe
                            </p>
                          </div>
                        </div>
                
                        {/* Form Card */}
                        <form onSubmit={savePendidikan}>
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
                              {/* ── Section 1: Data Pendidikan ── */}
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
                                    <span className="text-xl">🎓</span>
                                    Data Pendidikan
                                  </h2>
                                </div>
                
                                <div className="grid grid-cols-1 gap-6 mt-6">
                                  {/* Pendidikan Terakhir */}
                                  <div>
                                    <label
                                      className="block text-sm font-semibold mb-2"
                                      style={{ color: isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)" }}
                                    >
                                      Pendidikan Terakhir <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <select
                                        name="pendidikanTerakhir"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                                        style={{
                                            background: isDark
                                            ? "rgba(255,255,255,.12)"
                                            : "rgba(0,0,0,.03)",
                                            border: `1px solid ${isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.1)"}`,
                                            color: isDark ? "white" : "black",
                                        }}
                                        value={pendidikanTerakhir === "" ? "" : pendidikanTerakhir.toString()}
                                        onChange={(e) =>
                                            setPendidikanTerakhir(e.target.value)
                                        }
                                        onFocus={(e) => {
                                            e.target.style.borderColor = currentColor;
                                            e.target.style.background = isDark
                                            ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.12)`
                                            : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.05)`;
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = isDark
                                            ? "rgba(255,255,255,.15)"
                                            : "rgba(0,0,0,.1)";
                                            e.target.style.background = isDark
                                            ? "rgba(255,255,255,.12)"
                                            : "rgba(0,0,0,.03)";
                                        }}
                                        >
                                        <option value="" style={{color: "black"}}>-- Pilih Pendidikan Terakhir --</option>
                                        <option value="SD" style={{color: "black"}}>SD (Sekolah Dasar)</option>
                                        <option value="SMP" style={{color: "black"}}>SMP (Sekolah Menengah Pertama)</option>
                                        <option value="SMA" style={{color: "black"}}>SMA (Sekolah Menengah Atas)</option>
                                        <option value="D1" style={{color: "black"}}>D1 (Diploma 1)</option>
                                        <option value="D2" style={{color: "black"}}>D2 (Diploma 2)</option>
                                        <option value="D3" style={{color: "black"}}>D3 (Diploma 3)</option>
                                        <option value="S1" style={{color: "black"}}>S1 (Sarjana)</option>
                                        <option value="S2" style={{color: "black"}}>S2 (Magister)</option>
                                        <option value="S3" style={{color: "black"}}>S3 (Doktor)</option>
                                    </select>
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
                                  <>
                                    Simpan
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
  )
}

export default AddPendidikan
