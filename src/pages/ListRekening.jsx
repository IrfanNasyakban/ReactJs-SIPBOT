import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiEye, HiPencil, HiTrash, HiPlus, HiSearch,
} from "react-icons/hi";
import { useStateContext } from "../contexts/ContextProvider";
import { dummyRekening } from "../data/dummy";

const ITEMS_PER_PAGE = 10;

const ListRekening = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [rekening] = useState(dummyRekening);
  const [isLoading] = useState(false);

  const navigate = useNavigate();
  const { currentColor, currentMode } = useStateContext();
  const isDark = currentMode === 'Dark';

  const filtered = rekening.filter(
    (r) => r.nama.toLowerCase().includes(search.toLowerCase()) ||
           r.nomor_rek_gaji.includes(search) ||
           r.nama_bank.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (id) => {
    setConfirmDelete(null);
  };

  const formatRekening = (nomor) => {
    // Format nomor rekening dengan spasi setiap 4 digit
    return nomor.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className={`min-h-screen overflow-hidden font-sans ${
      isDark ? 'bg-[#040c24]' : 'bg-gray-50'
    }`}>

      {/* ── Background ── */}
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
      
      <div
        className="fixed rounded-full pointer-events-none z-0 animate-[orb1_12s_ease-in-out_infinite]"
        style={{
          width: 380, height: 380, filter: "blur(80px)",
          background: isDark ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.28)` : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.15)`, 
          top: -100, left: -80,
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0 animate-[orb2_15s_ease-in-out_infinite]"
        style={{
          width: 340, height: 340, filter: "blur(80px)",
          background: isDark ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.32)` : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.18)`, 
          bottom: -80, right: -60,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 p-7">

        {/* Top bar */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className={`text-xl font-bold tracking-wide ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Data <span style={{ color: currentColor }}>Rekening</span>
            </h1>
            <p className="text-xs mt-1" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}>
              Manajemen data rekening gaji dan informasi bank pegawai
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <HiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)" }}
              />
              <input
                type="text"
                placeholder="Cari nama / rekening / bank..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className={`pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all duration-200 w-56 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
                style={{
                  background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.03)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentColor;
                  e.target.style.background = isDark ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)` : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.05)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)";
                  e.target.style.background = isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.03)";
                }}
              />
            </div>
            {/* Add Button */}
            <button
              onClick={() => navigate("/add-rekening")}
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

        {/* Table card */}
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
              background: isDark ? "linear-gradient(90deg,transparent,rgba(56,139,255,.5),transparent)" : `linear-gradient(90deg,transparent,${currentColor}80,transparent)`,
            }}
          />

          {/* Loading overlay */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div
                className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: "rgba(255,255,255,.1)", borderTopColor: "#60a5fa" }}
              />
            </div>
          )}

          {/* Scrollable table */}
          {!isLoading && (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 1200, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: isDark ? "rgba(56,139,255,.1)" : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`, borderBottom: `1px solid ${isDark ? "rgba(56,139,255,.2)" : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.15)`}` }}>
                    {[
                      "No", "Nama", "Nomor Rek Gaji", "Nama Bank", "Kantor Cabang", "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left whitespace-nowrap"
                        style={{
                          fontSize: 11, fontWeight: 600, letterSpacing: "1.5px",
                          textTransform: "uppercase", color: isDark ? "rgba(140,180,255,.7)" : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.7)`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16"
                          style={{ color: isDark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.3)", fontSize: 14 }}>
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  ) : (
                    paginated.map((r, i) => (
                      <tr
                        key={r.uuid}
                        style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)"}` }}
                        className={`transition-colors duration-150 ${isDark ? 'hover:bg-blue-500/5' : 'hover:bg-gray-100/30'}`}
                      >
                        {/* No */}
                        <td className="px-4 py-3 text-sm"
                            style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.5)" }}>
                          {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                        </td>
                        {/* Nama */}
                        <td className="px-4 py-3">
                          <span className={`text-sm font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {r.nama}
                          </span>
                        </td>
                        {/* Nomor Rek Gaji */}
                        <td className="px-4 py-3 text-sm font-mono" style={{ color: currentColor }}>
                          {formatRekening(r.nomor_rek_gaji)}
                        </td>
                        {/* Nama Bank */}
                        <td className="px-4 py-3 text-sm font-semibold" style={{ color: isDark ? "rgba(220,235,255,.8)" : "rgba(0,0,0,.7)" }}>
                          {r.nama_bank}
                        </td>
                        {/* Kantor Cabang */}
                        <td className="px-4 py-3 text-sm" style={{ color: isDark ? "rgba(220,235,255,.8)" : "rgba(0,0,0,.7)" }}>
                          {r.nama_kantor_cabang}
                        </td>
                        {/* Aksi */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View */}
                            <button
                              onClick={() => navigate(`/rekening/${r.uuid}`)}
                              title="Lihat Detail"
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                              style={{
                                background: "transparent",
                                border: `1px solid ${isDark ? "rgba(55,138,221,.35)" : "rgba(0,0,0,.1)"}`,
                                color: currentColor,
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = isDark ? "rgba(55,138,221,.2)" : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.1)`}
                              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                              <HiEye className="w-3.5 h-3.5" />
                            </button>
                            {/* Edit */}
                            <button
                              onClick={() => navigate(`/rekening/edit/${r.uuid}`)}
                              title="Edit"
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                              style={{
                                background: "transparent",
                                border: "1px solid rgba(186,117,23,.35)",
                                color: "#fbbf24",
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(186,117,23,.2)"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                              <HiPencil className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => setConfirmDelete(r.uuid)}
                              title="Hapus"
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                              style={{
                                background: "transparent",
                                border: "1px solid rgba(220,38,38,.35)",
                                color: "#f87171",
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(220,38,38,.2)"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                              <HiTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filtered.length > 0 && (
            <div
              className="flex items-center justify-between px-5 py-3.5 flex-wrap gap-3"
              style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}` }}
            >
              <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}>
                Menampilkan{" "}
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} dari{" "}
                {filtered.length} data
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all duration-150 disabled:opacity-30"
                  style={{ border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`, color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)", background: "transparent" }}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className="w-8 h-8 rounded-lg text-xs flex items-center justify-center font-semibold transition-all duration-150"
                    style={{
                      border: pg === currentPage ? `1px solid ${currentColor}` : `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                      background: pg === currentPage ? `${currentColor}4d` : "transparent",
                      color: pg === currentPage ? currentColor : isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)",
                    }}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all duration-150 disabled:opacity-30"
                  style={{ border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`, color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)", background: "transparent" }}
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
          style={{ background: isDark ? "rgba(0,0,0,.6)" : "rgba(0,0,0,.4)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-2xl p-7 relative overflow-hidden"
            style={{
              background: isDark ? "rgba(4,12,36,.95)" : "rgba(255,255,255,.95)",
              border: `1px solid ${isDark ? "rgba(220,38,38,.3)" : "rgba(220,38,38,.2)"}`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{ background: "linear-gradient(90deg,transparent,rgba(220,38,38,.6),transparent)" }} />
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.3)" }}
            >
              <HiTrash className="w-5 h-5 text-red-400" />
            </div>
            <h3 className={`font-semibold text-center text-base mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Hapus Data Rekening?
            </h3>
            <p className="text-center text-sm mb-6" style={{ color: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.5)" }}>
              Tindakan ini tidak dapat dibatalkan. Data rekening akan dihapus secara permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)",
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

export default ListRekening;
