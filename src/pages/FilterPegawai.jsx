import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiFilter,
  HiCheck,
  HiX,
  HiTable,
  HiChevronDown,
  HiChevronUp,
  HiDownload,
} from "react-icons/hi";
import { BsCheckAll } from "react-icons/bs";

// ── Column definitions & data extractor ──────────────────
const ALL_COLUMNS = [
  { key: "nip",              label: "NIP",                      group: "Identitas" },
  { key: "nama",             label: "Nama",                     group: "Identitas" },
  { key: "gelarDepan",       label: "Gelar Depan",              group: "Identitas" },
  { key: "gelarBelakang",    label: "Gelar Belakang",           group: "Identitas" },
  { key: "namaDenganGelar",  label: "Nama dengan Gelar",        group: "Identitas" },
  { key: "jabatan",          label: "Jabatan",                  group: "Kepegawaian" },
  { key: "tmtJabatan",       label: "TMT Jabatan",              group: "Kepegawaian" },
  { key: "bagianKerja",      label: "Bagian Kerja",             group: "Kepegawaian" },
  { key: "tempatLahir",      label: "Tempat Lahir",             group: "Identitas" },
  { key: "tanggalLahir",     label: "Tanggal Lahir",            group: "Identitas" },
  { key: "gender",           label: "Jenis Kelamin",            group: "Identitas" },
  { key: "statusKepegawaian",label: "Status Kepegawaian",       group: "Kepegawaian" },
  { key: "pangkat",          label: "Pangkat",                  group: "Pangkat" },
  { key: "golonganRuang",    label: "Golongan Ruang",           group: "Pangkat" },
  { key: "tmtPangkat",       label: "TMT Pangkat",              group: "Pangkat" },
  { key: "eselon",           label: "Eselon",                   group: "Kepegawaian" },
  { key: "agama",            label: "Agama",                    group: "Identitas" },
  { key: "alamatDomisili",   label: "Alamat Domisili",          group: "Alamat" },
  { key: "alamatKTP",        label: "Alamat KTP",               group: "Alamat" },
  { key: "noHp",             label: "No Telpon",                group: "Kontak" },
  { key: "tmtPensiun",       label: "TMT Pensiun",              group: "Kepegawaian" },
  { key: "angkatanPejim",    label: "Angkatan Pejim",           group: "Kepegawaian" },
  { key: "ppns",             label: "PPNS",                     group: "Kepegawaian" },
  { key: "pendidikanTerakhir",label: "Pendidikan Terakhir",     group: "Pendidikan" },
  { key: "nomorBPJS",        label: "Nomor BPJS",               group: "Identitas" },
  { key: "nomorTaspen",      label: "Nomor Taspen",             group: "Identitas" },
  { key: "namaPasangan",     label: "Nama Pasangan",            group: "Keluarga" },
  { key: "emailDinas",       label: "Email Dinas",              group: "Kontak" },
  { key: "emailPribadi",     label: "Email Pribadi",            group: "Kontak" },
  { key: "nik",              label: "NIK",                      group: "Identitas" },
  { key: "nomorKK",          label: "Nomor KK",                 group: "Identitas" },
  { key: "nomorRekGaji",     label: "Nomor Rek Gaji",           group: "Rekening" },
  { key: "namaBank",         label: "Nama Bank",                group: "Rekening" },
  { key: "kantorCabang",     label: "Kantor Cabang Bank",       group: "Rekening" },
  { key: "tinggiBadan",      label: "Tinggi Badan (CM)",        group: "Fisik" },
  { key: "beratBadan",       label: "Berat Badan (KG)",         group: "Fisik" },
  { key: "jenisRambut",      label: "Jenis Rambut",             group: "Fisik" },
  { key: "warnaRambut",      label: "Warna Rambut",             group: "Fisik" },
  { key: "bentukWajah",      label: "Bentuk Wajah",             group: "Fisik" },
  { key: "warnaKulit",       label: "Warna Kulit",              group: "Fisik" },
  { key: "ciriKhusus",       label: "Ciri Khusus",              group: "Fisik" },
  { key: "hobi",             label: "Hobi",                     group: "Lainnya" },
  { key: "ukuranPadDivamot", label: "Ukuran PAD dan DIVAMOT",   group: "Ukuran" },
  { key: "ukuranSepatu",     label: "Ukuran Sepatu Dinas",      group: "Ukuran" },
  { key: "ukuranTopi",       label: "Ukuran Topi",              group: "Ukuran" },
  { key: "statusPegawai",    label: "Status Pegawai (Aktif/Tidak Aktif)", group: "Kepegawaian" },
  { key: "namaAnak",         label: "Nama Anak",                group: "Keluarga" },
];

const GROUPS = [...new Set(ALL_COLUMNS.map(c => c.group))];

const GROUP_COLORS = {
  Identitas:    "#388BFF",
  Kepegawaian:  "#10B981",
  Pangkat:      "#F59E0B",
  Alamat:       "#EF4444",
  Kontak:       "#14B8A6",
  Pendidikan:   "#8B5CF6",
  Keluarga:     "#EC4899",
  Rekening:     "#F97316",
  Fisik:        "#06B6D4",
  Ukuran:       "#6366F1",
  Lainnya:      "#9CA3AF",
};

// ── Extract value from nested API response ───────────────
function extractValue(pegawai, key) {
  const fmt = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    return isNaN(dt) ? d : dt.toLocaleDateString("id-ID", { day:"2-digit", month:"2-digit", year:"numeric" });
  };

  switch (key) {
    case "nip":              return pegawai.nip || "-";
    case "nama":             return pegawai.nama || "-";
    case "gelarDepan":       return pegawai.gelarDepan || "-";
    case "gelarBelakang":    return pegawai.gelarBelakang || "-";
    case "namaDenganGelar":  return pegawai.namaDenganGelar || "-";
    case "tempatLahir":      return pegawai.tempatLahir || "-";
    case "tanggalLahir":     return fmt(pegawai.tanggalLahir);
    case "gender":           return pegawai.gender || "-";
    case "agama":            return pegawai.agama || "-";
    case "emailPribadi":     return pegawai.emailPribadi || "-";
    case "emailDinas":       return pegawai.emailDinas || "-";
    case "noHp":             return pegawai.noHp || "-";
    case "hobi":             return pegawai.hobi || "-";
    case "statusPegawai":    return pegawai.statusPegawai ? "Aktif" : "Tidak Aktif";

    case "jabatan":          return pegawai.kepegawaians?.[0]?.jabatan || "-";
    case "tmtJabatan":       return fmt(pegawai.kepegawaians?.[0]?.tmtJabatan);
    case "bagianKerja":      return pegawai.kepegawaians?.[0]?.bagianKerja || "-";
    case "eselon":           return pegawai.kepegawaians?.[0]?.eselon || "-";
    case "statusKepegawaian":return pegawai.kepegawaians?.[0]?.statusKepegawaian || "-";
    case "angkatanPejim":    return pegawai.kepegawaians?.[0]?.angkatanPejim || "-";
    case "ppns":             return pegawai.kepegawaians?.[0]?.ppns || "-";
    case "tmtPensiun":       return fmt(pegawai.kepegawaians?.[0]?.tmtPensiun);

    case "pangkat":          return pegawai.pangkats?.[0]?.pangkat || "-";
    case "golonganRuang":    return pegawai.pangkats?.[0]?.golonganRuang || "-";
    case "tmtPangkat":       return fmt(pegawai.pangkats?.[0]?.tmtPangkat);

    case "alamatKTP":        return pegawai.alamats?.[0]?.alamatKTP || "-";
    case "alamatDomisili":   return pegawai.alamats?.[0]?.alamatDomisili || "-";

    case "nik":              return pegawai.identitas?.[0]?.nik || "-";
    case "nomorKK":          return pegawai.identitas?.[0]?.nomorKK || "-";
    case "nomorBPJS":        return pegawai.identitas?.[0]?.nomorBPJS || "-";
    case "nomorTaspen":      return pegawai.identitas?.[0]?.nomorTaspen || "-";

    case "pendidikanTerakhir": return pegawai.pendidikans?.[0]?.pendidikanTerakhir || "-";

    case "namaPasangan":     return pegawai.pasangans?.[0]?.namaPasangan || "-";

    case "namaAnak":
      return pegawai.anaks?.length
        ? pegawai.anaks.map(a => a.namaAnak).join(", ")
        : "-";

    case "nomorRekGaji":     return pegawai.rekenings?.[0]?.nomorRekGaji || "-";
    case "namaBank":         return pegawai.rekenings?.[0]?.namaBank || "-";
    case "kantorCabang":     return pegawai.rekenings?.[0]?.kantorCabang || "-";

    case "tinggiBadan":      return pegawai.fisiks?.[0]?.tinggiBadan ?? "-";
    case "beratBadan":       return pegawai.fisiks?.[0]?.beratBadan ?? "-";
    case "jenisRambut":      return pegawai.fisiks?.[0]?.jenisRambut || "-";
    case "warnaRambut":      return pegawai.fisiks?.[0]?.warnaRambut || "-";
    case "bentukWajah":      return pegawai.fisiks?.[0]?.bentukWajah || "-";
    case "warnaKulit":       return pegawai.fisiks?.[0]?.warnaKulit || "-";
    case "ciriKhusus":       return pegawai.fisiks?.[0]?.ciriKhusus || "-";

    case "ukuranPadDivamot": return pegawai.ukurans?.[0]?.ukuranPadDivamot || "-";
    case "ukuranSepatu":     return pegawai.ukurans?.[0]?.ukuranSepatu || "-";
    case "ukuranTopi":       return pegawai.ukurans?.[0]?.ukuranTopi || "-";

    default: return "-";
  }
}

// ── Checkbox item ────────────────────────────────────────
// BUG FIX: Tambahkan onClick={onChange} pada <label> dan hidden <input>
// agar klik pada label meneruskan event ke toggleCol di parent.
function ColCheckbox({ col, checked, onChange, currentColor, isDark }) {
  const hex = currentColor || "#388BFF";
  const groupColor = GROUP_COLORS[col.group] || hex;
  return (
    <label
      onClick={(e) => {
        e.preventDefault(); // cegah double-fire dari label+input
        onChange();
      }}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none group"
      style={{
        background: checked ? `${groupColor}15` : "transparent",
        border: `1px solid ${checked ? groupColor + "40" : "transparent"}`,
      }}
    >
      {/* Input tersembunyi untuk aksesibilitas keyboard */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        tabIndex={-1}
      />
      <div
        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-150"
        style={{
          background: checked ? groupColor : "transparent",
          border: `2px solid ${checked ? groupColor : isDark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.2)"}`,
        }}
      >
        {checked && <HiCheck className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>
      <span
        className="text-xs font-medium leading-tight transition-colors"
        style={{
          color: checked
            ? isDark ? "white" : "#111827"
            : isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)",
        }}
      >
        {col.label}
      </span>
    </label>
  );
}

// ── Main Component ────────────────────────────────────────
const FilterPegawai = () => {
  const [allPegawai, setAllPegawai] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCols, setSelectedCols] = useState([]);
  const [appliedCols, setAppliedCols] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [searchTable, setSearchTable] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentColor, currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  const hex = currentColor || "#388BFF";
  const rgb = [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ].join(",");

  useEffect(() => { dispatch(getMe()); }, [dispatch]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) getAllPegawai();
    else navigate("/");
  }, [navigate]);

  const getAllPegawai = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/all-pegawai`);
      setAllPegawai(response.data || []);
    } catch (err) {
      console.error("Error fetching pegawai:", err);
      setAllPegawai([]);
    } finally {
      setIsLoading(false);
    }
  };

  // BUG FIX: toggleCol sekarang dipanggil dengan benar dari ColCheckbox
  const toggleCol = (key) => {
    setSelectedCols(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const selectAll = () => setSelectedCols(ALL_COLUMNS.map(c => c.key));
  const clearAll  = () => setSelectedCols([]);

  const applyFilter = () => {
    if (selectedCols.length === 0) return;
    const ordered = ALL_COLUMNS.filter(c => selectedCols.includes(c.key));
    setAppliedCols(ordered);
    setFilteredData(allPegawai);
    setHasApplied(true);
    setSearchTable("");
  };

  const toggleGroup = (g) =>
    setCollapsedGroups(prev => ({ ...prev, [g]: !prev[g] }));

  const tableRows = searchTable.trim()
    ? filteredData.filter(p =>
        appliedCols.some(col => {
          const v = extractValue(p, col.key);
          return String(v).toLowerCase().includes(searchTable.toLowerCase());
        })
      )
    : filteredData;

  // CSV export
  const exportCSV = () => {
    const headers = ["No", ...appliedCols.map(c => c.label)];
    const rows = tableRows.map((p, i) => [
      i + 1,
      ...appliedCols.map(c => {
        const v = extractValue(p, c.key);
        return `"${String(v).replace(/"/g, '""')}"`;
      }),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "filter_pegawai.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-300"
      style={{ background: isDark ? "#040c24" : "#f1f5f9" }}
    >
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `
          linear-gradient(${isDark ? "rgba(56,139,255,.05)" : "rgba(148,163,184,.07)"} 0.4px, transparent 0.5px),
          linear-gradient(90deg, ${isDark ? "rgba(56,139,255,.05)" : "rgba(148,163,184,.07)"} 0.4px, transparent 0.5px)
        `,
        backgroundSize: "48px 48px",
      }} />
      <div className="fixed rounded-full pointer-events-none z-0" style={{
        width: 400, height: 400, filter: "blur(90px)", top: -120, left: -80,
        background: isDark ? `rgba(${rgb},.22)` : `rgba(${rgb},.1)`,
      }} />
      <div className="fixed rounded-full pointer-events-none z-0" style={{
        width: 300, height: 300, filter: "blur(80px)", bottom: -60, right: -60,
        background: isDark ? `rgba(${rgb},.2)` : `rgba(${rgb},.08)`,
      }} />

      <div className="relative z-10 p-6 md:p-8">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7"
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `rgba(${rgb},.15)`, border: `1px solid rgba(${rgb},.25)` }}
            >
              <HiFilter className="w-5 h-5" style={{ color: hex }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: isDark ? "white" : "#0f172a" }}>
                Data Filter <span style={{ color: hex }}>Pegawai</span>
              </h1>
              <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.45)" }}>
                Pilih kolom data yang ingin ditampilkan
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Column Selector Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            background: isDark ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.92)",
            border: `1px solid ${isDark ? "rgba(56,139,255,.15)" : "rgba(0,0,0,.08)"}`,
            backdropFilter: "blur(20px)",
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,.4)" : "0 4px 20px rgba(0,0,0,.07)",
          }}
        >
          {/* Top accent */}
          <div className="h-px" style={{
            background: `linear-gradient(90deg,transparent,rgba(${rgb},.5),transparent)`,
          }} />

          {/* Header row */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-6 pt-5 pb-4"
            style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded flex items-center justify-center"
                style={{ background: hex }}
              >
                <BsCheckAll className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-sm" style={{ color: isDark ? "white" : "#0f172a" }}>
                Pilih Kolom Data
              </span>
              {selectedCols.length > 0 && (
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: `rgba(${rgb},.15)`, color: hex }}
                >
                  {selectedCols.length} terpilih
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: `rgba(${rgb},.12)`,
                  color: hex,
                  border: `1px solid rgba(${rgb},.25)`,
                }}
              >
                <HiCheck className="w-3.5 h-3.5" /> Pilih Semua
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)",
                  color: isDark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.5)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                }}
              >
                <HiX className="w-3.5 h-3.5" /> Hapus Semua
              </button>
            </div>
          </div>

          {/* Groups */}
          <div className="p-6 space-y-4">
            {GROUPS.map(group => {
              const cols = ALL_COLUMNS.filter(c => c.group === group);
              const groupColor = GROUP_COLORS[group] || hex;
              const isCollapsed = collapsedGroups[group];
              const groupSelected = cols.filter(c => selectedCols.includes(c.key)).length;

              return (
                <div key={group}
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}`,
                  }}
                >
                  {/* Group header */}
                  <button
                    onClick={() => toggleGroup(group)}
                    className="w-full flex items-center justify-between px-4 py-2.5 transition-colors"
                    style={{
                      background: isDark ? `${groupColor}10` : `${groupColor}08`,
                      borderBottom: isCollapsed ? "none" : `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)"}`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: groupColor }} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: groupColor }}>
                        {group}
                      </span>
                      {groupSelected > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: `${groupColor}20`, color: groupColor }}>
                          {groupSelected}/{cols.length}
                        </span>
                      )}
                    </div>
                    {isCollapsed
                      ? <HiChevronDown className="w-4 h-4" style={{ color: groupColor }} />
                      : <HiChevronUp className="w-4 h-4" style={{ color: groupColor }} />
                    }
                  </button>

                  {/* Checkboxes grid */}
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="grid p-3"
                          style={{
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "4px",
                            background: isDark ? "rgba(255,255,255,.01)" : "rgba(0,0,0,.01)",
                          }}
                        >
                          {cols.map(col => (
                            <ColCheckbox
                              key={col.key}
                              col={col}
                              checked={selectedCols.includes(col.key)}
                              onChange={() => toggleCol(col.key)}
                              currentColor={groupColor}
                              isDark={isDark}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Bottom accent */}
          <div className="h-px" style={{
            background: `linear-gradient(90deg,transparent,rgba(${rgb},.3),transparent)`,
          }} />

          {/* Apply button */}
          <div
            className="px-6 py-4 flex items-center justify-center"
            style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)"}` }}
          >
            <motion.button
              onClick={applyFilter}
              disabled={selectedCols.length === 0 || isLoading}
              whileHover={selectedCols.length > 0 ? { scale: 1.03, y: -1 } : {}}
              whileTap={selectedCols.length > 0 ? { scale: 0.97 } : {}}
              className="flex items-center gap-2.5 px-8 py-3 rounded-xl text-white text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: selectedCols.length > 0
                  ? `linear-gradient(135deg, ${hex}, rgba(${rgb},.8))`
                  : isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)",
                boxShadow: selectedCols.length > 0 ? `0 4px 18px rgba(${rgb},.35)` : "none",
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: "rgba(255,255,255,.25)", borderTopColor: "white" }} />
                  Memuat data...
                </>
              ) : (
                <>
                  <HiTable className="w-4 h-4" />
                  Terapkan Filter
                  {selectedCols.length > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {selectedCols.length} kolom
                    </span>
                  )}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* ── Result Table ── */}
        <AnimatePresence>
          {hasApplied && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: isDark ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.92)",
                border: `1px solid ${isDark ? "rgba(56,139,255,.15)" : "rgba(0,0,0,.08)"}`,
                backdropFilter: "blur(20px)",
                boxShadow: isDark ? "0 8px 32px rgba(0,0,0,.4)" : "0 4px 20px rgba(0,0,0,.07)",
              }}
            >
              <div className="h-px" style={{
                background: `linear-gradient(90deg,transparent,rgba(${rgb},.5),transparent)`,
              }} />

              {/* Table header bar */}
              <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-4"
                style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}` }}
              >
                <div className="flex items-center gap-3">
                  <HiTable className="w-5 h-5" style={{ color: hex }} />
                  <span className="font-bold text-sm" style={{ color: isDark ? "white" : "#0f172a" }}>
                    Hasil Filter
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                    style={{ background: `rgba(${rgb},.12)`, color: hex }}>
                    {tableRows.length} pegawai
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Search within table */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari dalam tabel..."
                      value={searchTable}
                      onChange={e => setSearchTable(e.target.value)}
                      className="pl-3 pr-8 py-2 rounded-xl text-xs outline-none transition-all"
                      style={{
                        background: isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.04)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}`,
                        color: isDark ? "white" : "#111827",
                        width: 180,
                      }}
                    />
                  </div>
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      background: isDark ? "rgba(16,185,129,.12)" : "rgba(16,185,129,.1)",
                      color: "#10B981",
                      border: "1px solid rgba(16,185,129,.25)",
                    }}
                  >
                    <HiDownload className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{
                      background: isDark
                        ? "linear-gradient(135deg,#1a2640,#111827)"
                        : "linear-gradient(135deg,#1e3a5f,#1d4ed8)",
                    }}>
                      <th className="text-left px-5 py-3.5 text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                        style={{ borderRight: "1px solid rgba(255,255,255,.08)" }}>
                        No
                      </th>
                      {appliedCols.map((col, ci) => {
                        const gc = GROUP_COLORS[col.group] || "#fff";
                        return (
                          <th key={col.key}
                            className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                            style={{
                              color: gc,
                              borderRight: ci < appliedCols.length - 1
                                ? "1px solid rgba(255,255,255,.07)" : "none",
                            }}
                          >
                            {col.label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.length === 0 ? (
                      <tr>
                        <td colSpan={appliedCols.length + 1} className="text-center py-12"
                          style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)" }}>
                          Tidak ada data yang cocok
                        </td>
                      </tr>
                    ) : (
                      tableRows.map((pegawai, ri) => (
                        <motion.tr
                          key={pegawai.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ri * 0.03 }}
                          className="transition-colors duration-100 group"
                          style={{
                            background: ri % 2 === 0
                              ? isDark ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.7)"
                              : isDark ? "rgba(255,255,255,.01)" : "rgba(248,250,252,.8)",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = isDark
                              ? `rgba(${rgb},.07)`
                              : `rgba(${rgb},.04)`;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = ri % 2 === 0
                              ? isDark ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.7)"
                              : isDark ? "rgba(255,255,255,.01)" : "rgba(248,250,252,.8)";
                          }}
                        >
                          <td className="px-5 py-3 text-xs font-bold"
                            style={{
                              color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)",
                              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)"}`,
                              borderRight: `1px solid ${isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)"}`,
                            }}>
                            {ri + 1}
                          </td>
                          {appliedCols.map((col, ci) => {
                            const val = extractValue(pegawai, col.key);
                            const isStatus = col.key === "statusPegawai";
                            return (
                              <td key={col.key}
                                className="px-5 py-3 text-xs"
                                style={{
                                  color: isDark ? "rgba(255,255,255,.75)" : "rgba(15,23,42,.75)",
                                  borderBottom: `1px solid ${isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)"}`,
                                  borderRight: ci < appliedCols.length - 1
                                    ? `1px solid ${isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)"}` : "none",
                                  whiteSpace: "nowrap",
                                  maxWidth: 200,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {isStatus ? (
                                  <span
                                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                      background: val === "Aktif" ? "rgba(16,185,129,.15)" : "rgba(239,68,68,.15)",
                                      color: val === "Aktif" ? "#10B981" : "#EF4444",
                                    }}
                                  >
                                    ● {val}
                                  </span>
                                ) : val}
                              </td>
                            );
                          })}
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="px-6 py-3 flex items-center justify-between"
                style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)"}` }}
              >
                <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)" }}>
                  Menampilkan {tableRows.length} dari {allPegawai.length} pegawai · {appliedCols.length} kolom
                </p>
                <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.3)" }}>
                  Kantor Imigrasi Kelas II TPI Lhokseumawe
                </p>
              </div>

              <div className="h-px" style={{
                background: `linear-gradient(90deg,transparent,rgba(${rgb},.3),transparent)`,
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FilterPegawai;