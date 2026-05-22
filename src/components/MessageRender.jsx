import React, { useMemo } from "react";

// ─── SECTION META ────────────────────────────────────────────────────────────
const SECTION_ICONS = {
  "identitas pegawai": { icon: "🪪", color: "#6366F1" },
  kepegawaian:         { icon: "🏢", color: "#10B981" },
  pangkat:             { icon: "⭐", color: "#F59E0B" },
  keluarga:            { icon: "👨‍👧", color: "#EC4899" },
  anak:                { icon: "👶", color: "#EC4899" },
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
    for (const row of dataRows) {
      const cols = parseCols(row);
      headers.forEach((h, i) => {
        if (cols[i] && cols[i] !== "-" && cols[i] !== "—") fields[h] = cols[i];
      });
    }
  }
  return fields;
}

// ─── PARSER ──────────────────────────────────────────────────────────────────
function parseBlocks(text) {
  const rawLines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const blocks = [];

  let currentEmployee = null;
  let currentSection  = null;
  let currentTable    = [];
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
    if (/^###\s+/.test(line)) {
      flushEmployee();
      const title = line.replace(/^###\s+/, "").trim();
      currentEmployee = { heading: title, sections: {} };
      currentSection  = null;
      continue;
    }
    if (/^####\s+/.test(line)) {
      flushTable();
      currentSection = line.replace(/^####\s+/, "").trim();
      if (currentEmployee && !currentEmployee.sections[currentSection]) {
        currentEmployee.sections[currentSection] = {};
      }
      continue;
    }
    if (line.startsWith("|") && line.endsWith("|")) {
      if (!currentEmployee) {
        currentEmployee = { heading: "Info Pegawai", sections: {} };
        currentSection  = "Info Pegawai";
      }
      currentTable.push(line);
      continue;
    }
    flushTable();
    if (!currentEmployee) introLines.push(line);
  }

  flushEmployee();

  if (introLines.length > 0) blocks.unshift({ type: "intro", text: introLines.join(" ") });
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

// ─── EMPLOYEE CARD ────────────────────────────────────────────────────────────
function EmployeeCard({ data, isDark }) {
  const allFields = Object.values(data).reduce((acc, s) => ({ ...acc, ...s }), {});

  const name    = fuzzyGet(allFields, "Nama", "NamaDenganGelar", "NamaLengkap") || "—";
  const nip     = fuzzyGet(allFields, "NIP", "No NIP", "NoNIP") || "—";
  const jabatan = fuzzyGet(allFields, "Jabatan");
  const status  = fuzzyGet(allFields, "Status Pegawai", "Status", "StatusKepegawaian");
  const isAktif = status ? status.toLowerCase().includes("aktif") : false;
  const isRingkasan = Object.keys(data).some(k => k.toLowerCase().includes("ringkasan"));

  const HEADER_FIELDS = new Set(["nama", "nip", "namadenganggelar", "namalengkap"]);
  const isHeaderField = (k) => HEADER_FIELDS.has(k.toLowerCase().replace(/[\s._-]/g, ""));

  // Colors
  const textPrimary   = isDark ? "#ffffff" : "#0f172a";
  const textSecondary = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
  const cardBg        = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder    = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const rowDivider    = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <div style={{
      borderRadius: 14,
      overflow: "hidden",
      marginBottom: 10,
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      boxShadow: isDark
        ? "0 2px 16px rgba(0,0,0,0.3)"
        : "0 2px 12px rgba(0,0,0,0.07)",
    }}>
      {/* ── Header ── */}
      <div style={{
        background: isRingkasan
          ? "linear-gradient(135deg, #1e3a5f, #388BFF)"
          : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {isRingkasan ? (
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Ringkasan Data</div>
          ) : (
            <>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, marginBottom: 3, lineHeight: 1.3 }}>
                {name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>NIP: {nip}</div>
              {jabatan && (
                <div style={{
                  display: "inline-block", marginTop: 6,
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff", fontSize: 11,
                  padding: "2px 10px", borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.25)",
                }}>
                  {jabatan}
                </div>
              )}
            </>
          )}
        </div>
        {!isRingkasan && status && (
          <div style={{
            background: isAktif ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
            color: isAktif ? "#34D399" : "#F87171",
            fontSize: 11, fontWeight: 700,
            padding: "4px 12px", borderRadius: 999, flexShrink: 0,
            border: `1px solid ${isAktif ? "rgba(52,211,153,0.4)" : "rgba(248,113,113,0.4)"}`,
          }}>
            ● {status}
          </div>
        )}
      </div>

      {/* ── Sections ── */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.entries(data).map(([secTitle, fields]) => {
          if (!fields || Object.keys(fields).length === 0) return null;

          const displayFields = isRingkasan
            ? fields
            : Object.fromEntries(Object.entries(fields).filter(([k]) => !isHeaderField(k)));

          if (Object.keys(displayFields).length === 0) return null;

          const meta = getSectionMeta(secTitle);

          return (
            <div key={secTitle} style={{
              borderRadius: 10,
              overflow: "hidden",
              border: `1px solid ${cardBorder}`,
            }}>
              {/* Section label */}
              <div style={{
                padding: "7px 14px",
                display: "flex", alignItems: "center", gap: 8,
                background: isDark
                  ? `${meta.color}18`
                  : `${meta.color}12`,
                borderBottom: `1px solid ${rowDivider}`,
              }}>
                <span style={{ fontSize: 14 }}>{meta.icon}</span>
                <span style={{
                  color: meta.color,
                  fontWeight: 700, fontSize: 11,
                  textTransform: "uppercase", letterSpacing: "0.09em",
                }}>
                  {secTitle}
                </span>
              </div>

              {/* Fields — simple rows */}
              <div>
                {Object.entries(displayFields).map(([k, v], fi, arr) => (
                  <div key={k} style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                    padding: "10px 14px",
                    borderBottom: fi < arr.length - 1 ? `1px solid ${rowDivider}` : "none",
                  }}>
                    <div style={{
                      width: 160,
                      flexShrink: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: textSecondary,
                      lineHeight: 1.4,
                    }}>
                      {k}
                    </div>
                    <div style={{
                      flex: 1,
                      fontSize: 15,
                      fontWeight: 600,
                      color: textPrimary,
                      wordBreak: "break-word",
                      lineHeight: 1.4,
                    }}>
                      {v || "—"}
                    </div>
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
export default function MessageRenderer({ text, isDark }) {
  const blocks = useMemo(() => {
    if (!text) return null;
    if (!text.includes("###")) return null;
    try { return parseBlocks(text); } catch { return null; }
  }, [text]);

  const textPrimary = isDark ? "#ffffff" : "#0f172a";

  if (!blocks || blocks.length === 0) {
    return (
      <p style={{
        margin: 0,
        lineHeight: 1.75,
        fontSize: 15,
        fontWeight: 500,
        color: textPrimary,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {renderInline(text)}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {blocks.map((block, i) => {
        if (block.type === "intro") {
          return (
            <p key={i} style={{
              margin: "0 0 6px",
              lineHeight: 1.75,
              fontSize: 15,
              fontWeight: 500,
              color: textPrimary,
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