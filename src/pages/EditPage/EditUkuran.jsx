import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";

import { BsPersonFill } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";

const EditUkuran = () => {
  const [ukuranPadDivamot, setUkuranPadDivamot] = useState("");
  const [ukuranSepatu, setUkuranSepatu] = useState("");
  const [ukuranTopi, setUkuranTopi] = useState("");

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
      getUkuranById();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getUkuranById = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`http://localhost:5000/ukuran/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUkuranPadDivamot(response.data.ukuranPadDivamot);
    setUkuranSepatu(response.data.ukuranSepatu);
    setUkuranTopi(response.data.ukuranTopi);
    setNamaDenganGelar(response.data.pegawai.namaDenganGelar);
    setNip(response.data.pegawai.nip);
  };

  const updateUkuran = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("ukuranPadDivamot", ukuranPadDivamot);
    formData.append("ukuranSepatu", ukuranSepatu);
    formData.append("ukuranTopi", ukuranTopi);

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`http://localhost:5000/ukuran/${id}`, jsonData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      navigate("/ukuran");
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
                onClick={() => navigate("/ukuran")}
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
                Edit Data <span style={{ color: currentColor }}>Ukuran</span>
              </h1>
            </div>
            <p
              className="text-xs ml-11 mt-1"
              style={{
                color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)",
              }}
            >
              Formulir Perubahan Data Ukuran Pegawai - Kantor Imigrasi Kelas II
              TPI Lhokseumawe
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={updateUkuran}>
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

              {/* ── Section 1: Ukuran Seragam & Perlengkapan Dinas ── */}
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
                    Ukuran Seragam & Perlengkapan Dinas
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-6">
                  {/* Ukuran PDH/PDL (Pakaian Dinas) */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Ukuran PDH/PDL (Pakaian Dinas){" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      name="ukuranPadDivamot"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={ukuranPadDivamot}
                      onChange={(e) => setUkuranPadDivamot(e.target.value)}
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
                      <option value="">-- Pilih Ukuran --</option>
                      <option value="XS" style={{ color: "black" }}>
                        XS
                      </option>
                      <option value="S" style={{ color: "black" }}>
                        S
                      </option>
                      <option value="M" style={{ color: "black" }}>
                        M
                      </option>
                      <option value="L" style={{ color: "black" }}>
                        L
                      </option>
                      <option value="XL" style={{ color: "black" }}>
                        XL
                      </option>
                      <option value="XXL" style={{ color: "black" }}>
                        XXL
                      </option>
                      <option value="XXXL" style={{ color: "black" }}>
                        XXXL
                      </option>
                      <option value="XXXXL" style={{ color: "black" }}>
                        XXXXL
                      </option>
                    </select>
                  </div>

                  {/* Ukuran Sepatu */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Ukuran Sepatu <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      name="ukuranSepatu"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={ukuranSepatu}
                      onChange={(e) => setUkuranSepatu(e.target.value)}
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
                      <option value="">-- Pilih Ukuran --</option>
                      <option value="36" style={{ color: "black" }}>
                        36
                      </option>
                      <option value="37" style={{ color: "black" }}>
                        37
                      </option>
                      <option value="38" style={{ color: "black" }}>
                        38
                      </option>
                      <option value="39" style={{ color: "black" }}>
                        39
                      </option>
                      <option value="40" style={{ color: "black" }}>
                        40
                      </option>
                      <option value="41" style={{ color: "black" }}>
                        41
                      </option>
                      <option value="42" style={{ color: "black" }}>
                        42
                      </option>
                      <option value="43" style={{ color: "black" }}>
                        43
                      </option>
                      <option value="44" style={{ color: "black" }}>
                        44
                      </option>
                      <option value="45" style={{ color: "black" }}>
                        45
                      </option>
                      <option value="46" style={{ color: "black" }}>
                        46
                      </option>
                    </select>
                  </div>

                  {/* Ukuran Topi */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,.8)"
                          : "rgba(0,0,0,.7)",
                      }}
                    >
                      Ukuran Topi <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      name="ukuranTopi"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,.05)"
                          : "rgba(0,0,0,.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "black",
                      }}
                      value={ukuranTopi}
                      onChange={(e) => setUkuranTopi(e.target.value)}
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
                      <option value="">-- Pilih Ukuran --</option>
                      <option value="52" style={{ color: "black" }}>
                        52
                      </option>
                      <option value="53" style={{ color: "black" }}>
                        53
                      </option>
                      <option value="54" style={{ color: "black" }}>
                        54
                      </option>
                      <option value="55" style={{ color: "black" }}>
                        55
                      </option>
                      <option value="56" style={{ color: "black" }}>
                        56
                      </option>
                      <option value="57" style={{ color: "black" }}>
                        57
                      </option>
                      <option value="58" style={{ color: "black" }}>
                        58
                      </option>
                      <option value="59" style={{ color: "black" }}>
                        59
                      </option>
                      <option value="60" style={{ color: "black" }}>
                        60
                      </option>
                      <option value="61" style={{ color: "black" }}>
                        61
                      </option>
                      <option value="62" style={{ color: "black" }}>
                        62
                      </option>
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
                onClick={() => navigate("/ukuran")}
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

export default EditUkuran;
