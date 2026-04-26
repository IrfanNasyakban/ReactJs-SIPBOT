import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getMe } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { HiPencil, HiTrash, HiPlus, HiSearch } from "react-icons/hi";
import { useStateContext } from "../contexts/ContextProvider";

const ITEMS_PER_PAGE = 10;

const ListAnak = () => {
  const [anak, setAnak] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentColor, currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getAnak();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getAnak = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;

      const response = await axios.get(`${apiUrl}/anak`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setAnak(response.data);
      } else {
        setAnak([]);
      }
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching Anak:", err);
      setAnak([]);
    }
  };

  // Group anak by pegawai
  const groupedByPegawai = anak.reduce((acc, item) => {
    const key = item.pegawai?.namaDenganGelar || "Unknown";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  const filtered = Object.entries(groupedByPegawai)
    .filter(([pegawaiName]) =>
      pegawaiName.toLowerCase().includes(search.toLowerCase()),
    )
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const totalPages = Math.ceil(Object.keys(filtered).length / ITEMS_PER_PAGE);
  const paginatedKeys = Object.keys(filtered).slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const paginated = paginatedKeys.reduce((acc, key) => {
    acc[key] = filtered[key];
    return acc;
  }, {});

  const handleDelete = (id) => {
    setConfirmDelete(null);
  };

  return (
    <div
      className={`min-h-screen overflow-hidden font-sans ${
        isDark ? "bg-[#040c24]" : "bg-gray-50"
      }`}
    >
      {/* ── Background ── */}
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

      <div
        className="fixed rounded-full pointer-events-none z-0 animate-[orb1_12s_ease-in-out_infinite]"
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
        className="fixed rounded-full pointer-events-none z-0 animate-[orb2_15s_ease-in-out_infinite]"
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
        {/* Top bar */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1
              className={`text-xl font-bold tracking-wide ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Data <span style={{ color: currentColor }}>Anak</span>
            </h1>
            <p
              className="text-xs mt-1"
              style={{
                color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)",
              }}
            >
              Manajemen data informasi Anak / keluarga pegawai
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <HiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{
                  color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)",
                }}
              />
              <input
                type="text"
                placeholder="Cari nama pegawai..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className={`pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all duration-200 w-56 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
                style={{
                  background: isDark
                    ? "rgba(255,255,255,.06)"
                    : "rgba(0,0,0,.03)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentColor;
                  e.target.style.background = isDark
                    ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`
                    : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.05)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark
                    ? "rgba(255,255,255,.12)"
                    : "rgba(0,0,0,.1)";
                  e.target.style.background = isDark
                    ? "rgba(255,255,255,.06)"
                    : "rgba(0,0,0,.03)";
                }}
              />
            </div>
            {/* Add Button */}
            <button
              onClick={() => navigate("/add-anak")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-88 hover:-translate-y-0.5"
              style={{
                background: currentColor,
                boxShadow: `0 4px 18px ${currentColor}4d`,
              }}
            >
              <HiPlus className="w-4 h-4" />
              Tambah Data
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
            border: `1px solid ${isDark ? "rgba(56,139,255,.18)" : "rgba(0,0,0,.1)"}`,
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Top highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: isDark
                ? "linear-gradient(90deg,transparent,rgba(56,139,255,.5),transparent)"
                : `linear-gradient(90deg,transparent,${currentColor}80,transparent)`,
            }}
          />

          {/* Cards Container */}
          <div className="p-8">
            {Object.keys(paginated).length === 0 ? (
              <div
                className="text-center py-16"
                style={{
                  color: isDark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.3)",
                  fontSize: 14,
                }}
              >
                Tidak ada data ditemukan
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(paginated).map(([pegawaiName, anakList]) => (
                  <div
                    key={pegawaiName}
                    className="rounded-xl overflow-hidden transition-all duration-200 hover:scale-102"
                    style={{
                      background: isDark
                        ? "rgba(255,255,255,.05)"
                        : "rgba(0,0,0,.02)",
                      border: `1px solid ${isDark ? "rgba(56,139,255,.15)" : "rgba(0,0,0,.08)"}`,
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {/* Card Header */}
                    <div
                      className="p-5 pb-4 border-b"
                      style={{
                        borderColor: isDark
                          ? "rgba(56,139,255,.15)"
                          : "rgba(0,0,0,.08)",
                        background: isDark
                          ? "rgba(56,139,255,.05)"
                          : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.04)`,
                      }}
                    >
                      <p
                        className="text-xs font-semibold mb-2"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,.4)"
                            : "rgba(0,0,0,.5)",
                        }}
                      >
                        PEGAWAI
                      </p>
                      <h3
                        className="text-sm font-bold"
                        style={{ color: currentColor }}
                      >
                        {pegawaiName}
                      </h3>
                      <p
                        className="text-xs mt-2"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,.3)"
                            : "rgba(0,0,0,.4)",
                        }}
                      >
                        {anakList.length} anak
                      </p>
                    </div>

                    {/* Card Body - Children List */}
                    <div className="p-5 space-y-3">
                      {anakList.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-lg transition-all duration-150"
                          style={{
                            background: isDark
                              ? "rgba(255,255,255,.03)"
                              : "rgba(0,0,0,.01)",
                            border: `1px solid ${isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)"}`,
                          }}
                        >
                          <div className="flex-1">
                            <p
                              className="text-xs"
                              style={{
                                color: isDark
                                  ? "rgba(255,255,255,.4)"
                                  : "rgba(0,0,0,.5)",
                              }}
                            >
                              Anak {idx + 1}
                            </p>
                            <p
                              className="text-sm font-semibold mt-0.5"
                              style={{
                                color: currentColor,
                              }}
                            >
                              {item.namaAnak}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1.5 ml-3">
                            {/* Edit */}
                            <button
                              onClick={() =>
                                navigate(`/anak/edit/${item.id}`)
                              }
                              title="Edit"
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                              style={{
                                background: "transparent",
                                border: "1px solid rgba(186,117,23,.35)",
                                color: "#fbbf24",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                  "rgba(186,117,23,.2)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  "transparent")
                              }
                            >
                              <HiPencil className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() =>
                                setConfirmDelete(item.id)
                              }
                              title="Hapus"
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                              style={{
                                background: "transparent",
                                border: "1px solid rgba(220,38,38,.35)",
                                color: "#f87171",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                  "rgba(220,38,38,.2)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  "transparent")
                              }
                            >
                              <HiTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom highlight */}
          <div
            className="h-px pointer-events-none"
            style={{
              background: isDark
                ? "linear-gradient(90deg,transparent,rgba(56,139,255,.3),transparent)"
                : `linear-gradient(90deg,transparent,${currentColor}60,transparent)`,
            }}
          />

          {/* Pagination */}
          {Object.keys(filtered).length > 0 && (
            <div
              className="flex items-center justify-between px-8 py-5 flex-wrap gap-3"
              style={{
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}`,
              }}
            >
              <p
                className="text-xs"
                style={{
                  color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)",
                }}
              >
                Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  Object.keys(filtered).length,
                )}{" "}
                dari {Object.keys(filtered).length} pegawai
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all duration-150 disabled:opacity-30"
                  style={{
                    border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                    color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)",
                    background: "transparent",
                  }}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className="w-8 h-8 rounded-lg text-xs flex items-center justify-center font-semibold transition-all duration-150"
                      style={{
                        border:
                          pg === currentPage
                            ? `1px solid ${currentColor}`
                            : `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                        background:
                          pg === currentPage
                            ? `${currentColor}4d`
                            : "transparent",
                        color:
                          pg === currentPage
                            ? currentColor
                            : isDark
                              ? "rgba(255,255,255,.5)"
                              : "rgba(0,0,0,.5)",
                      }}
                    >
                      {pg}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((a) => Math.min(a + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all duration-150 disabled:opacity-30"
                  style={{
                    border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                    color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)",
                    background: "transparent",
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Confirm Delete Modal ── */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: isDark ? "rgba(0,0,0,.6)" : "rgba(0,0,0,.4)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-2xl p-7 relative overflow-hidden"
            style={{
              background: isDark
                ? "rgba(4,12,36,.95)"
                : "rgba(255,255,255,.95)",
              border: `1px solid ${isDark ? "rgba(220,38,38,.3)" : "rgba(220,38,38,.2)"}`,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(220,38,38,.6),transparent)",
              }}
            />
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(220,38,38,.1)",
                border: "1px solid rgba(220,38,38,.3)",
              }}
            >
              <HiTrash className="w-5 h-5 text-red-400" />
            </div>
            <h3
              className={`font-semibold text-center text-base mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Hapus Data Anak?
            </h3>
            <p
              className="text-center text-sm mb-6"
              style={{
                color: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.5)",
              }}
            >
              Tindakan ini tidak dapat dibatalkan. Data Anak akan dihapus
              secara permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,.06)"
                    : "rgba(0,0,0,.05)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                  color: isDark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.6)",
                }}
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150"
                style={{
                  background: "linear-gradient(135deg,#dc2626,#ef4444)",
                  boxShadow: "0 4px 16px rgba(220,38,38,.3)",
                }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAnak;
