import React, { useMemo } from "react";

const SECTION_ICONS = {
  "identitas pegawai": { icon: "🪪", color: "#6366F1" },
  kepegawaian:         { icon: "🏢", color: "#10B981" },
  pangkat:             { icon: "⭐", color: "#F59E0B" },
  keluarga:            { icon: "👨‍👧", color: "#EC4899" },
  anak:                { icon: "👨‍👧", color: "#EC4899" },
  pendidikan:          { icon: "🎓", color: "#8B5CF6" },
  ukuran:              { icon: "📏", color: "#06B6D4" },
  alamat:              { icon: "📍", color: "#EF4444" },
  identitas:           { icon: "🪪", color: "#6366F1" },
  pasangan:            { icon: "💑", color: "#F43F5E" },
  fisik:               { icon: "💪", color: "#14B8A6" },
  rekening:            { icon: "🏦", color: "#F97316" },
  ringkasan:           { icon: "📊", color: "#388BFF" },
};

function getSectionMeta(title = "") {
  const key = title.toLowerCase();
  for (const [k, v] of Object.entries(SECTION_ICONS)) {
    if (key.includes(k)) return v;
  }
  return { icon: "📋", color: "#64748b" };
}

function renderInline(text) {
  if (!text) return null;
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  );
}

function isSeparatorRow(line) {
  return line.split("|").map(c => c.trim()).filter(Boolean).every(c => /^:?-+:?$/.test(c));
}

function parseCols(line) {
  return line.split("|").map(c => c.trim()).filter(Boolean);
}

function fuzzyGet(obj, ...keys) {
  for (const k of keys) {
    const norm = k.toLowerCase().replace(/[\s._-]/g, "");
    const found = Object.keys(obj).find(
      f => f.toLowerCase().replace(/[\s._-]/g, "") === norm
    );
    if (found && obj[found] && obj[found] !== "-" && obj[found] !== "—") return obj[found];
  }
  return null;
}

// Parse tabel | Field | Value | → object
function parseFieldValueTable(tableLines) {
  const nonSep = tableLines.filter(l => !isSeparatorRow(l));
  if (nonSep.length < 1) return {};
  const headers = parseCols(nonSep[0]);
  const isFieldValue =
    headers.length === 2 &&
    headers[0].toLowerCase() === "field" &&
    headers[1].toLowerCase() === "value";

  const fields = {};
  const dataRows = nonSep.slice(1);

  if (isFieldValue) {
    for (const row of dataRows) {
      const cols = parseCols(row);
      if (cols.length >= 2 && cols[0].toLowerCase() !== "field") {
        fields[cols[0]] = cols[1];
      }
    }
  } else {
    // multi-kolom: setiap baris jadi entry terpisah tapi gabung ke fields
    for (const row of dataRows) {
      const cols = parseCols(row);
      headers.forEach((h, i) => {
        if (cols[i] && cols[i] !== "-" && cols[i] !== "—") fields[h] = cols[i];
      });
    }
  }
  return fields;
}

// ─── PARSER UTAMA ─────────────────────────────────────────────────────────────
function parseBlocks(text) {
  const rawLines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const blocks = [];

  // State machine: ### Pegawai → #### SubSection → | tabel |
  let currentEmployee = null;   // { sections: { sectionTitle: {fields} } }
  let currentSection  = null;   // string: nama #### heading
  let currentTable    = [];     // buffer baris tabel
  let introLines      = [];

  const flushTable = () => {
    if (currentTable.length === 0) return;
    const fields = parseFieldValueTable(currentTable);
    if (Object.keys(fields).length > 0) {
      const secKey = currentSection || "Info";
      if (!currentEmployee) currentEmployee = { sections: {} };
      if (!currentEmployee.sections[secKey]) currentEmployee.sections[secKey] = {};
      Object.assign(currentEmployee.sections[secKey], fields);
    }
    currentTable = [];
  };

  const flushEmployee = () => {
    flushTable();
    if (currentEmployee && Object.keys(currentEmployee.sections).length > 0) {
      blocks.push({ type: "employee", data: currentEmployee.sections });
    }
    currentEmployee = null;
    currentSection  = null;
  };

  for (const line of rawLines) {
    // ### heading → new employee card
    if (/^###\s+/.test(line)) {
      flushEmployee();
      const title = line.replace(/^###\s+/, "").trim();
      currentEmployee = { heading: title, sections: {} };
      currentSection  = null;
      continue;
    }

    // #### heading → new sub-section dalam card yang sama
    if (/^####\s+/.test(line)) {
      flushTable();
      currentSection = line.replace(/^####\s+/, "").trim();
      if (currentEmployee && !currentEmployee.sections[currentSection]) {
        currentEmployee.sections[currentSection] = {};
      }
      continue;
    }

    // Baris tabel
    if (line.startsWith("|") && line.endsWith("|")) {
      if (!currentEmployee) {
        // Tabel tanpa ### heading
        currentEmployee = { heading: "Info Pegawai", sections: {} };
        currentSection  = "Info Pegawai";
      }
      currentTable.push(line);
      continue;
    }

    // Baris teks biasa
    flushTable();
    if (!currentEmployee) {
      introLines.push(line);
    }
  }

  flushEmployee();

  if (introLines.length > 0) {
    blocks.unshift({ type: "intro", text: introLines.join(" ") });
  }

  // Fallback: format lama **field**: value
  if (blocks.length === 0) return parseLegacyFormat(rawLines);

  return blocks;
}

function parseLegacyFormat(lines) {
  const blocks = [];
  let cur = null, sec = null;
  const intro = [];
  let inEmp = false;
  for (const line of lines) {
    if (/^###\s*Pegawai\s*\d+/i.test(line)) {
      if (cur) blocks.push({ type: "employee", data: cur });
      cur = {}; sec = null; inEmp = true; continue;
    }
    if (/^###\s*/.test(line)) {
      sec = line.replace(/^###\s*/, "").trim();
      if (!cur) cur = {};
      if (!cur[sec]) cur[sec] = {};
      continue;
    }
    const m = line.match(/^\*?\s*\*\*([^*]+)\*\*\s*[:\-]\s*(.+)/);
    if (m) {
      if (!cur) cur = {};
      const s = sec || "Info";
      if (!cur[s]) cur[s] = {};
      cur[s][m[1].trim()] = m[2].trim();
      continue;
    }
    if (!inEmp) intro.push(line);
  }
  if (cur && Object.keys(cur).length > 0) blocks.push({ type: "employee", data: cur });
  if (intro.length > 0) blocks.unshift({ type: "intro", text: intro.join(" ") });
  return blocks;
}

// ─── EMPLOYEE CARD ─────────────────────────────────────────────────────────────
function EmployeeCard({ data, isDark }) {
  const allFields = Object.values(data).reduce((acc, s) => ({ ...acc, ...s }), {});

  const name    = fuzzyGet(allFields, "Nama", "NamaDenganGelar", "NamaLengkap") || "—";
  const nip     = fuzzyGet(allFields, "NIP", "No NIP", "NoNIP") || "—";
  const jabatan = fuzzyGet(allFields, "Jabatan");
  const status  = fuzzyGet(allFields, "Status Pegawai", "Status", "StatusKepegawaian");
  const isAktif = status ? status.toLowerCase().includes("aktif") : false;
  const isRingkasan = Object.keys(data).some(k => k.toLowerCase().includes("ringkasan"));

  // Field yang sudah tampil di header → disembunyikan dari body
  const HEADER_FIELDS = new Set(["nama", "nip", "namadenganggelar", "namalengkap"]);
  const isHeaderField = (k) => HEADER_FIELDS.has(k.toLowerCase().replace(/[\s._-]/g, ""));

  return (
    <div style={{
      border: `1px solid ${isDark ? "rgba(56,139,255,0.2)" : "rgba(59,130,246,0.15)"}`,
      borderRadius: 16, overflow: "hidden", marginBottom: 12,
      background: isDark ? "#0d1117" : "#fff",
      boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 2px 12px rgba(59,130,246,0.08)",
    }}>
      {/* ── Header ── */}
      <div style={{
        background: isRingkasan
          ? "linear-gradient(135deg,#1e3a5f,#388BFF)"
          : "linear-gradient(135deg,#1d4ed8,#3b82f6)",
        padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.18)", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0, border: "2px solid rgba(255,255,255,0.3)",
        }}>
          {isRingkasan ? "📊" : "👤"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {isRingkasan ? (
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Ringkasan Data</div>
          ) : (
            <>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{name}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>NIP: {nip}</div>
              {jabatan && (
                <div style={{
                  display: "inline-block", marginTop: 5,
                  background: "rgba(255,255,255,0.15)", color: "#fff",
                  fontSize: 10, padding: "2px 10px", borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.25)",
                }}>{jabatan}</div>
              )}
            </>
          )}
        </div>
        {!isRingkasan && status && (
          <div style={{
            background: isAktif ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
            color: isAktif ? "#34D399" : "#F87171",
            fontSize: 10, fontWeight: 700,
            padding: "3px 10px", borderRadius: 999, flexShrink: 0,
            border: `1px solid ${isAktif ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)"}`,
          }}>● {status}</div>
        )}
      </div>

      {/* ── Sections ── */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.entries(data).map(([secTitle, fields]) => {
          if (!fields || Object.keys(fields).length === 0) return null;

          const displayFields = isRingkasan
            ? fields
            : Object.fromEntries(Object.entries(fields).filter(([k]) => !isHeaderField(k)));

          if (Object.keys(displayFields).length === 0) return null;

          const meta = getSectionMeta(secTitle);

          return (
            <div key={secTitle} style={{
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: 10, overflow: "hidden",
            }}>
              {/* Section header */}
              <div style={{
                background: isDark ? `${meta.color}22` : `${meta.color}14`,
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                padding: "6px 12px", display: "flex", alignItems: "center", gap: 7,
              }}>
                <span style={{ fontSize: 13 }}>{meta.icon}</span>
                <span style={{
                  color: meta.color, fontWeight: 700, fontSize: 10,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  {secTitle}
                </span>
              </div>

              {/* Fields grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))" }}>
                {Object.entries(displayFields).map(([k, v], fi, arr) => (
                  <div key={k} style={{
                    padding: "8px 12px",
                    borderBottom: fi < arr.length - 2
                      ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`
                      : "none",
                    borderRight: fi % 2 === 0
                      ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`
                      : "none",
                  }}>
                    <div style={{
                      fontSize: 9, fontWeight: 700,
                      color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                      textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3,
                    }}>{k}</div>
                    <div style={{
                      fontSize: 12, fontWeight: 500,
                      color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.82)",
                      wordBreak: "break-word", lineHeight: 1.4,
                    }}>{v || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function MessageRenderer({ text, isDark, isStreaming = false }) {
  const blocks = useMemo(() => {
    if (isStreaming) return null;
    if (!text) return null;

    // ✅ Hanya parse sebagai card jika ada ### heading
    // Teks biasa (jawaban "siapa", "apa", dll) tidak punya ###
    if (!text.includes("###")) return null;

    try { return parseBlocks(text); } catch { return null; }
  }, [text, isStreaming]);

  if (!blocks || blocks.length === 0) {
    return (
      <p style={{
        margin: 0, lineHeight: 1.7, fontSize: 14,
        whiteSpace: "pre-wrap", wordBreak: "break-word"
      }}>
        {isStreaming ? text : renderInline(text)}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {blocks.map((block, i) => {
        if (block.type === "intro") {
          return (
            <p key={i} style={{
              margin: "0 0 4px", lineHeight: 1.7, fontSize: 14,
              color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)"
            }}>
              {renderInline(block.text)}
            </p>
          );
        }
        if (block.type === "employee") {
          return <EmployeeCard key={i} data={block.data} isDark={isDark} />;
        }
        return null;
      })}
    </div>
  );
}