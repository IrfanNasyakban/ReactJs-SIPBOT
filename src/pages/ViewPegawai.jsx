import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";
import {
  HiPencil,
  HiArrowLeft,
  HiUser,
  HiMail,
  HiOfficeBuilding,
  HiStar,
  HiIdentification,
  HiChip,
  HiCreditCard,
  HiHeart,
  HiLocationMarker,
  HiShoppingBag,
} from "react-icons/hi";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Section = ({ icon: Icon, title, accentColor, isDark, children, colSpan }) => (
  <div
    className={colSpan || ""}
    style={{
      borderRadius: 16,
      overflow: "hidden",
      border: `1px solid ${isDark ? "rgba(56,139,255,.15)" : "rgba(0,0,0,.08)"}`,
      background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.02)",
      backdropFilter: "blur(12px)",
    }}
  >
    {/* Header */}
    <div
      style={{
        padding: "14px 20px",
        borderBottom: `1px solid ${isDark ? "rgba(56,139,255,.15)" : "rgba(0,0,0,.08)"}`,
        background: isDark
          ? "rgba(56,139,255,.05)"
          : `rgba(${parseInt(accentColor.slice(1, 3), 16)},${parseInt(accentColor.slice(3, 5), 16)},${parseInt(accentColor.slice(5, 7), 16)},.04)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `rgba(${parseInt(accentColor.slice(1, 3), 16)},${parseInt(accentColor.slice(3, 5), 16)},${parseInt(accentColor.slice(5, 7), 16)},.12)`,
          border: `1px solid rgba(${parseInt(accentColor.slice(1, 3), 16)},${parseInt(accentColor.slice(3, 5), 16)},${parseInt(accentColor.slice(5, 7), 16)},.25)`,
          color: accentColor,
        }}
      >
        <Icon style={{ width: 15, height: 15 }} />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.5)",
        }}
      >
        {title}
      </span>
    </div>
    {/* Body */}
    <div style={{ padding: "16px 20px" }}>{children}</div>
  </div>
);

const Row = ({ label, value, isDark, currentColor }) => (
  <div style={{ marginBottom: 14 }}>
    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)",
        marginBottom: 3,
        textTransform: "uppercase",
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontSize: 14,
        fontWeight: 600,
        color: isDark ? "rgba(255,255,255,.9)" : "rgba(0,0,0,.85)",
        wordBreak: "break-word",
        lineHeight: 1.4,
      }}
    >
      {value || "-"}
    </p>
  </div>
);

const ViewPegawai = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentColor, currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  const [pegawai, setPegawai] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getPegawaiById();
    } else {
      navigate("/");
    }
  }, [navigate, id]);

  const getPegawaiById = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/pegawai/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPegawai(response.data);
    } catch (err) {
      console.error("Error fetching pegawai:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const p = pegawai;
  const alamat = p?.alamats?.[0] || {};
  const fisik = p?.fisiks?.[0] || {};
  const identitas = p?.identitas?.[0] || {};
  const kepegawaian = p?.kepegawaians?.[0] || {};
  const pangkat = p?.pangkats?.[0] || {};
  const pasangan = p?.pasangans?.[0] || {};
  const pendidikan = p?.pendidikans?.[0] || {};
  const rekening = p?.rekenings?.[0] || {};
  const ukuran = p?.ukurans?.[0] || {};
  const anaks = p?.anaks || [];

  return (
    <div
      className={`min-h-screen overflow-hidden font-sans ${isDark ? "bg-[#040c24]" : "bg-gray-50"}`}
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
      {/* ── Orbs ── */}
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
        {/* Top bar */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1
              className={`text-xl font-bold tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Profil <span style={{ color: currentColor }}>Pegawai</span>
            </h1>
            <p
              className="text-xs mt-1"
              style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.5)" }}
            >
              Detail informasi lengkap data pegawai
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/pegawai/edit/${id}`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "transparent",
                border: "1px solid rgba(251,191,36,.35)",
                color: "#fbbf24",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251,191,36,.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <HiPencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-88 hover:-translate-y-0.5"
              style={{
                background: currentColor,
                boxShadow: `0 4px 18px ${currentColor}4d`,
              }}
            >
              <HiArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          </div>
        </div>

        {/* ── Outer Card Wrapper ── */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
            border: `1px solid ${isDark ? "rgba(56,139,255,.18)" : "rgba(0,0,0,.1)"}`,
            backdropFilter: "blur(16px)",
          }}
        >
          {/* top highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: isDark
                ? "linear-gradient(90deg,transparent,rgba(56,139,255,.5),transparent)"
                : `linear-gradient(90deg,transparent,${currentColor}80,transparent)`,
            }}
          />

          <div className="p-8">
            {isLoading ? (
              <div
                className="text-center py-20"
                style={{ color: isDark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.3)", fontSize: 14 }}
              >
                Memuat data...
              </div>
            ) : !p ? (
              <div
                className="text-center py-20"
                style={{ color: isDark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.3)", fontSize: 14 }}
              >
                Data pegawai tidak ditemukan.
              </div>
            ) : (
              <div className="space-y-5">
                {/* ── Hero Card ── */}
                <div
                  className="relative rounded-2xl overflow-hidden p-6 flex items-start gap-6 flex-wrap"
                  style={{
                    background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.02)",
                    border: `1px solid ${isDark ? "rgba(56,139,255,.18)" : "rgba(0,0,0,.08)"}`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                    style={{
                      background: `linear-gradient(90deg,transparent,${currentColor}80,transparent)`,
                    }}
                  />
                  {/* Avatar */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isDark
                        ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.12)`
                        : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.1)`,
                      border: `2px solid ${currentColor}50`,
                    }}
                  >
                    <HiUser style={{ width: 36, height: 36, color: currentColor }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-bold tracking-widest mb-1"
                      style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.4)" }}
                    >
                      PEGAWAI
                    </p>
                    <h2
                      className={`text-lg font-extrabold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {p.namaDenganGelar}
                    </h2>
                    <p
                      className="text-xs mt-1"
                      style={{ color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.45)" }}
                    >
                      NIP: {p.nip}
                    </p>
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {/* Status aktif */}
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: p.statusPegawai
                            ? "rgba(34,197,94,.1)"
                            : "rgba(239,68,68,.1)",
                          border: `1px solid ${p.statusPegawai ? "rgba(34,197,94,.35)" : "rgba(239,68,68,.35)"}`,
                          color: p.statusPegawai ? "#4ade80" : "#f87171",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: p.statusPegawai ? "#4ade80" : "#f87171",
                            display: "inline-block",
                          }}
                        />
                        {p.statusPegawai ? "Aktif" : "Tidak Aktif"}
                      </span>
                      {kepegawaian.jabatan && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: isDark
                              ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.1)`
                              : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`,
                            border: `1px solid ${currentColor}40`,
                            color: currentColor,
                          }}
                        >
                          {kepegawaian.jabatan}
                          {kepegawaian.bagianKerja ? ` · ${kepegawaian.bagianKerja}` : ""}
                        </span>
                      )}
                      {kepegawaian.eselon && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: "rgba(167,139,250,.1)",
                            border: "1px solid rgba(167,139,250,.3)",
                            color: "#a78bfa",
                          }}
                        >
                          {kepegawaian.eselon}
                        </span>
                      )}
                      {pendidikan.pendidikanTerakhir && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: "rgba(52,211,153,.1)",
                            border: "1px solid rgba(52,211,153,.3)",
                            color: "#34d399",
                          }}
                        >
                          {pendidikan.pendidikanTerakhir}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Golongan Callout */}
                  {pangkat.golonganRuang && (
                    <div className="flex-shrink-0 text-right">
                      <p
                        className="text-xs"
                        style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)" }}
                      >
                        Golongan
                      </p>
                      <p
                        className="text-3xl font-extrabold leading-none mt-1"
                        style={{ color: currentColor }}
                      >
                        {pangkat.golonganRuang}
                      </p>
                      {kepegawaian.statusKepegawaian && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)" }}
                        >
                          {kepegawaian.statusKepegawaian}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Main Grid 2-col ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Data Pribadi */}
                  <Section icon={HiUser} title="DATA PRIBADI" accentColor={currentColor} isDark={isDark}>
                    <Row label="Nama Lengkap" value={p.nama} isDark={isDark} currentColor={currentColor} />
                    <Row label="Tempat Lahir" value={p.tempatLahir} isDark={isDark} currentColor={currentColor} />
                    <Row label="Tanggal Lahir" value={formatDate(p.tanggalLahir)} isDark={isDark} currentColor={currentColor} />
                    <Row label="Jenis Kelamin" value={p.gender} isDark={isDark} currentColor={currentColor} />
                    <Row label="Agama" value={p.agama} isDark={isDark} currentColor={currentColor} />
                    <Row label="Hobi" value={p.hobi} isDark={isDark} currentColor={currentColor} />
                    <Row label="Gelar Depan" value={p.gelarDepan} isDark={isDark} currentColor={currentColor} />
                    <Row label="Gelar Belakang" value={p.gelarBelakang} isDark={isDark} currentColor={currentColor} />
                  </Section>

                  {/* Kontak */}
                  <Section icon={HiMail} title="KONTAK" accentColor="#34d399" isDark={isDark}>
                    <Row label="Email Pribadi" value={p.emailPribadi} isDark={isDark} currentColor={currentColor} />
                    <Row label="Email Dinas" value={p.emailDinas} isDark={isDark} currentColor={currentColor} />
                    <Row label="No. HP" value={p.noHp} isDark={isDark} currentColor={currentColor} />
                    <Row label="Username" value={p.user?.username} isDark={isDark} currentColor={currentColor} />
                    <Row label="Email Akun" value={p.user?.email} isDark={isDark} currentColor={currentColor} />
                  </Section>

                  {/* Kepegawaian */}
                  <Section icon={HiOfficeBuilding} title="KEPEGAWAIAN" accentColor="#fbbf24" isDark={isDark}>
                    <Row label="Status Kepegawaian" value={kepegawaian.statusKepegawaian} isDark={isDark} currentColor={currentColor} />
                    <Row label="Jabatan" value={kepegawaian.jabatan} isDark={isDark} currentColor={currentColor} />
                    <Row label="TMT Jabatan" value={formatDate(kepegawaian.tmtJabatan)} isDark={isDark} currentColor={currentColor} />
                    <Row label="Bagian Kerja" value={kepegawaian.bagianKerja} isDark={isDark} currentColor={currentColor} />
                    <Row label="Eselon" value={kepegawaian.eselon} isDark={isDark} currentColor={currentColor} />
                    <Row label="Angkatan PEJIM" value={kepegawaian.angkatanPejim} isDark={isDark} currentColor={currentColor} />
                    <Row label="PPNS" value={kepegawaian.ppns} isDark={isDark} currentColor={currentColor} />
                    <Row label="TMT Pensiun" value={formatDate(kepegawaian.tmtPensiun)} isDark={isDark} currentColor={currentColor} />
                  </Section>

                  {/* Pangkat */}
                  <Section icon={HiStar} title="PANGKAT" accentColor="#a78bfa" isDark={isDark}>
                    <Row label="Pangkat" value={pangkat.pangkat} isDark={isDark} currentColor={currentColor} />
                    <Row label="Golongan / Ruang" value={pangkat.golonganRuang} isDark={isDark} currentColor={currentColor} />
                    <Row label="Tanggal SK" value={formatDate(pangkat.tanggalSKPangkat)} isDark={isDark} currentColor={currentColor} />
                    <Row label="Nomor SK" value={pangkat.nomorSKPangkat} isDark={isDark} currentColor={currentColor} />
                    <Row label="SK Dari" value={pangkat.SKPangkatDari} isDark={isDark} currentColor={currentColor} />
                    <Row label="TMT Pangkat" value={formatDate(pangkat.tmtPangkat)} isDark={isDark} currentColor={currentColor} />
                    <Row label="Uraian SK" value={pangkat.uraianSKPangkat} isDark={isDark} currentColor={currentColor} />
                  </Section>

                  {/* Identitas */}
                  <Section icon={HiIdentification} title="IDENTITAS" accentColor="#fb7185" isDark={isDark}>
                    <Row label="NIK" value={identitas.nik} isDark={isDark} currentColor={currentColor} />
                    <Row label="Nomor KK" value={identitas.nomorKK} isDark={isDark} currentColor={currentColor} />
                    <Row label="Nomor BPJS" value={identitas.nomorBPJS} isDark={isDark} currentColor={currentColor} />
                    <Row label="Nomor Taspen" value={identitas.nomorTaspen} isDark={isDark} currentColor={currentColor} />
                  </Section>

                  {/* Data Fisik */}
                  <Section icon={HiChip} title="DATA FISIK" accentColor="#2dd4bf" isDark={isDark}>
                    <Row label="Tinggi Badan" value={fisik.tinggiBadan ? `${fisik.tinggiBadan} cm` : "-"} isDark={isDark} currentColor={currentColor} />
                    <Row label="Berat Badan" value={fisik.beratBadan ? `${fisik.beratBadan} kg` : "-"} isDark={isDark} currentColor={currentColor} />
                    <Row label="Jenis Rambut" value={fisik.jenisRambut} isDark={isDark} currentColor={currentColor} />
                    <Row label="Warna Rambut" value={fisik.warnaRambut} isDark={isDark} currentColor={currentColor} />
                    <Row label="Bentuk Wajah" value={fisik.bentukWajah} isDark={isDark} currentColor={currentColor} />
                    <Row label="Warna Kulit" value={fisik.warnaKulit} isDark={isDark} currentColor={currentColor} />
                    <Row label="Ciri Khusus" value={fisik.ciriKhusus} isDark={isDark} currentColor={currentColor} />
                  </Section>
                </div>

                {/* ── Bottom Row: Rekening · Ukuran · Keluarga ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Rekening */}
                  <Section icon={HiCreditCard} title="REKENING GAJI" accentColor="#22c55e" isDark={isDark}>
                    <Row label="Nomor Rekening" value={rekening.nomorRekGaji} isDark={isDark} currentColor={currentColor} />
                    <Row label="Nama Bank" value={rekening.namaBank} isDark={isDark} currentColor={currentColor} />
                    <Row label="Kantor Cabang" value={rekening.kantorCabang} isDark={isDark} currentColor={currentColor} />
                  </Section>

                  {/* Ukuran */}
                  <Section icon={HiShoppingBag} title="UKURAN" accentColor="#fbbf24" isDark={isDark}>
                    <Row label="Pakaian Divamot" value={ukuran.ukuranPadDivamot} isDark={isDark} currentColor={currentColor} />
                    <Row label="Sepatu" value={ukuran.ukuranSepatu} isDark={isDark} currentColor={currentColor} />
                    <Row label="Topi" value={ukuran.ukuranTopi} isDark={isDark} currentColor={currentColor} />
                  </Section>

                  {/* Keluarga */}
                  <Section icon={HiHeart} title="KELUARGA" accentColor={currentColor} isDark={isDark}>
                    <Row label="Pasangan" value={pasangan.namaPasangan} isDark={isDark} currentColor={currentColor} />
                    {anaks.length > 0 && (
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)",
                            marginBottom: 8,
                          }}
                        >
                          Anak
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {anaks.map((anak, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg p-2.5"
                              style={{
                                background: isDark
                                  ? `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.08)`
                                  : `rgba(${parseInt(currentColor.slice(1, 3), 16)},${parseInt(currentColor.slice(3, 5), 16)},${parseInt(currentColor.slice(5, 7), 16)},.06)`,
                                border: `1px solid ${currentColor}30`,
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  letterSpacing: "0.06em",
                                  textTransform: "uppercase",
                                  color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)",
                                  marginBottom: 3,
                                }}
                              >
                                Anak {idx + 1}
                              </p>
                              <p
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: isDark ? "rgba(255,255,255,.9)" : "rgba(0,0,0,.85)",
                                }}
                              >
                                {anak.namaAnak}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Section>
                </div>

                {/* ── Alamat ── */}
                <Section icon={HiLocationMarker} title="ALAMAT" accentColor="#f87171" isDark={isDark}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)",
                          marginBottom: 6,
                        }}
                      >
                        Alamat KTP
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isDark ? "rgba(255,255,255,.9)" : "rgba(0,0,0,.85)",
                          lineHeight: 1.5,
                        }}
                      >
                        {alamat.alamatKTP || "-"}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)",
                          marginBottom: 6,
                        }}
                      >
                        Alamat Domisili
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isDark ? "rgba(255,255,255,.9)" : "rgba(0,0,0,.85)",
                          lineHeight: 1.5,
                        }}
                      >
                        {alamat.alamatDomisili || "-"}
                      </p>
                    </div>
                  </div>
                </Section>
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
        </div>
      </div>
    </div>
  );
};

export default ViewPegawai;