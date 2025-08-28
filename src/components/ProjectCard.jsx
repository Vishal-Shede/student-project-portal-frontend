// src/components/ProjectCard.jsx

// truncate helper
function truncate(text = "", max = 160) {
  if (!text) return "No abstract provided.";
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}

function ProjectCard({
  title,
  year,
  abstract,
  githubUrl,
  pdfUrl,
  ownerName,
  isOwnerView = false,
  onEdit,
  onDelete,
}) {
  const safeTitle = title || "Untitled";
  const safeYear = year || "—";
  const safeOwner = ownerName || "Unknown";

  const linkStyle = { marginRight: "0.75rem" };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "1rem",
        margin: "0.5rem 0",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>
          {safeTitle} <span style={{ color: "#6b7280", fontWeight: 400 }}>({safeYear})</span>
        </h2>

        {isOwnerView && (
          <div>
            <button style={{ marginRight: 8 }} onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
          </div>
        )}
      </div>

      <p style={{ margin: "0.5rem 0 0.75rem" }}>{truncate(abstract, 160)}</p>

      <p style={{ margin: 0, color: "#6b7280" }}>
        <strong>By:</strong> {safeOwner}
      </p>

      <div style={{ marginTop: "0.75rem" }}>
        {githubUrl ? (
          <a href={githubUrl} target="_blank" rel="noreferrer" style={linkStyle}>GitHub</a>
        ) : null}
        {pdfUrl ? (
          <a href={pdfUrl} target="_blank" rel="noreferrer" style={linkStyle}>PDF</a>
        ) : null}
      </div>
    </div>
  );
}

export default ProjectCard;
