import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  HiEye, HiPencil, HiTrash, HiPlus, HiSearch,
} from "react-icons/hi";
import { dummyPegawai } from "../data/dummy";

const ITEMS_PER_PAGE = 10;

const ListPegawai = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [pegawai] = useState(dummyPegawai);
  const [isLoading] = useState(false);

  const navigate = useNavigate();

  const filtered = pegawai.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nip.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getInitials = (nama) => {
    const parts = nama.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : nama.substring(0, 2).toUpperCase();
  };

  const getFullName = (p) =>
    `${p.gelar_depan ? p.gelar_depan + " " : ""}${p.nama}${
      p.gelar_belakang ? ", " + p.gelar_belakang : ""
    }`;

  const statusBadge = (status) => {
    const map = {
      PNS: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      PPPK: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      Honorer: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    };
    return (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
          map[status] || "bg-white/5 text-white/50 border-white/10"
        }`}
      >
        {status}
      </span>
    );
  };

  const statCounts = {
    total: pegawai.length,
    pns: pegawai.filter((p) => p.status_pegawai === "PNS").length,
    pppk: pegawai.filter((p) => p.status_pegawai === "PPPK").length,
    honorer: pegawai.filter((p) => p.status_pegawai === "Honorer").length,
  };

  const handleDelete = (id) => {
    setConfirmDelete(null);
  };

  return (
    <div className="relative min-h-screen bg-[#040c24] overflow-hidden font-sans">

      {/* ── Background ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,139,255,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,139,255,.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(56,139,255,.015) 3px, rgba(56,139,255,.015) 4px
          )`,
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0 animate-[orb1_12s_ease-in-out_infinite]"
        style={{
          width: 380, height: 380, filter: "blur(80px)",
          background: "rgba(24,95,165,.28)", top: -100, left: -80,
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0 animate-[orb2_15s_ease-in-out_infinite]"
        style={{
          width: 340, height: 340, filter: "blur(80px)",
          background: "rgba(10,40,120,.32)", bottom: -80, right: -60,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 p-7">

        {/* Top bar */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Data <span className="text-blue-400">Pegawai</span>
            </h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,.35)" }}>
              Manajemen data seluruh pegawai Kantor Imigrasi TPI Kelas II Lhokseumawe
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <HiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "rgba(255,255,255,.3)" }}
              />
              <input
                type="text"
                placeholder="Cari nama / NIP..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all duration-200 w-56"
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(56,139,255,.7)";
                  e.target.style.background = "rgba(56,139,255,.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,.12)";
                  e.target.style.background = "rgba(255,255,255,.06)";
                }}
              />
            </div>
            {/* Add Button */}
            <button
              onClick={() => navigate("/pegawai/add")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-88 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#1d6fe8,#0ea5e9)",
                boxShadow: "0 4px 18px rgba(29,111,232,.3)",
              }}
            >
              <HiPlus className="w-4 h-4" />
              Tambah Pegawai
            </button>
          </div>
        </div>

        {/* Table card */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(56,139,255,.18)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Top highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg,transparent,rgba(56,139,255,.5),transparent)",
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
                  <tr style={{ background: "rgba(56,139,255,.1)", borderBottom: "1px solid rgba(56,139,255,.2)" }}>
                    {[
                      "No","NIP","Nama Pegawai","Gelar Depan","Gelar Belakang",
                      "Nama + Gelar","Tempat Lahir","Gender","Agama","Status",
                      "Email Pribadi","Email Dinas","No. Telp","Hobi","Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left whitespace-nowrap"
                        style={{
                          fontSize: 11, fontWeight: 600, letterSpacing: "1.5px",
                          textTransform: "uppercase", color: "rgba(140,180,255,.7)",
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
                      <td colSpan={15} className="text-center py-16"
                          style={{ color: "rgba(255,255,255,.25)", fontSize: 14 }}>
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  ) : (
                    paginated.map((p, i) => (
                      <tr
                        key={p.uuid}
                        style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}
                        className="transition-colors duration-150 hover:bg-blue-500/5"
                      >
                        {/* No */}
                        <td className="px-4 py-3 text-sm"
                            style={{ color: "rgba(255,255,255,.3)" }}>
                          {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                        </td>
                        {/* NIP */}
                        <td className="px-4 py-3 font-mono text-xs text-blue-300 whitespace-nowrap">
                          {p.nip}
                        </td>
                        {/* Nama */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-semibold text-white whitespace-nowrap">
                              {p.nama}
                            </span>
                          </div>
                        </td>
                        {/* Gelar Depan */}
                        <td className="px-4 py-3 text-sm" style={{ color: "rgba(220,235,255,.8)" }}>
                          {p.gelar_depan || <span style={{ color: "rgba(255,255,255,.2)" }}>—</span>}
                        </td>
                        {/* Gelar Belakang */}
                        <td className="px-4 py-3 text-sm" style={{ color: "rgba(220,235,255,.8)" }}>
                          {p.gelar_belakang || <span style={{ color: "rgba(255,255,255,.2)" }}>—</span>}
                        </td>
                        {/* Nama + Gelar */}
                        <td className="px-4 py-3 text-xs whitespace-nowrap"
                            style={{ color: "#c7d8f8" }}>
                          {getFullName(p)}
                        </td>
                        {/* Tempat Lahir */}
                        <td className="px-4 py-3 text-sm" style={{ color: "rgba(220,235,255,.8)" }}>
                          {p.tempat_lahir}
                        </td>
                        {/* Gender */}
                        <td className="px-4 py-3 text-sm font-semibold">
                          <span style={{ color: p.gender === "L" ? "#60a5fa" : "#f472b6" }}>
                            {p.gender}
                          </span>
                        </td>
                        {/* Agama */}
                        <td className="px-4 py-3 text-sm" style={{ color: "rgba(220,235,255,.8)" }}>
                          {p.agama}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">{statusBadge(p.status_pegawai)}</td>
                        {/* Email Pribadi */}
                        <td className="px-4 py-3 text-xs whitespace-nowrap"
                            style={{ color: "rgba(180,210,255,.7)" }}>
                          {p.email_pribadi}
                        </td>
                        {/* Email Dinas */}
                        <td className="px-4 py-3 text-xs whitespace-nowrap"
                            style={{ color: "rgba(180,210,255,.7)" }}>
                          {p.email_dinas}
                        </td>
                        {/* No Telp */}
                        <td className="px-4 py-3 text-sm" style={{ color: "rgba(220,235,255,.8)" }}>
                          {p.no_telp}
                        </td>
                        {/* Hobi */}
                        <td className="px-4 py-3 text-sm" style={{ color: "rgba(255,255,255,.45)" }}>
                          {p.hobi}
                        </td>
                        {/* Aksi */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View */}
                            <button
                              onClick={() => navigate(`/pegawai/${p.uuid}`)}
                              title="Lihat Detail"
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                              style={{
                                background: "transparent",
                                border: "1px solid rgba(55,138,221,.35)",
                                color: "#60a5fa",
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(55,138,221,.2)"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                              <HiEye className="w-3.5 h-3.5" />
                            </button>
                            {/* Edit */}
                            <button
                              onClick={() => navigate(`/pegawai/edit/${p.uuid}`)}
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
                              onClick={() => setConfirmDelete(p.uuid)}
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
              style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}
            >
              <p className="text-xs" style={{ color: "rgba(255,255,255,.35)" }}>
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
                  style={{ border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.5)", background: "transparent" }}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className="w-8 h-8 rounded-lg text-xs flex items-center justify-center font-semibold transition-all duration-150"
                    style={{
                      border: pg === currentPage ? "1px solid rgba(56,139,255,.7)" : "1px solid rgba(255,255,255,.12)",
                      background: pg === currentPage ? "rgba(56,139,255,.3)" : "transparent",
                      color: pg === currentPage ? "#60a5fa" : "rgba(255,255,255,.5)",
                    }}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all duration-150 disabled:opacity-30"
                  style={{ border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.5)", background: "transparent" }}
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
          style={{ background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-2xl p-7 relative overflow-hidden"
            style={{
              background: "rgba(4,12,36,.95)",
              border: "1px solid rgba(220,38,38,.3)",
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
            <h3 className="text-white font-semibold text-center text-base mb-2">
              Hapus Data Pegawai?
            </h3>
            <p className="text-center text-sm mb-6" style={{ color: "rgba(255,255,255,.4)" }}>
              Tindakan ini tidak dapat dibatalkan. Data pegawai akan dihapus secara permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  color: "rgba(255,255,255,.7)",
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

export default ListPegawai;