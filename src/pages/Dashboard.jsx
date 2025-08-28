import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { listMine } from "../api/projectsApi";

export default function Dashboard() {
  const [tab, setTab] = useState("my"); // "my" | "add"

  // state for My Projects
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // load only when the "my" tab is active (and on first mount)
  useEffect(() => {
    if (tab !== "my") return;

    let active = true;
    async function loadMine() {
      setLoading(true);
      setError("");
      try {
        const data = await listMine();
        if (!active) return;
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn("GET /me/projects failed, falling back to mock");
        try {
          const mod = await import("../data/my-projects.sample.json");
          if (active) setProjects(mod.default || []);
        } catch (e2) {
          if (active) setError("Failed to load your projects.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMine();
    return () => { active = false; };
  }, [tab]);

  // placeholders for later steps
  function startEdit(p) {
    alert(`Edit (coming soon): ${p.title}`);
    setTab("add"); // we'll open the form in edit mode later
  }
  function startDelete(p) {
    alert(`Delete (coming soon): ${p.title}`);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Dashboard</h1>

      {/* Tabs */}
      <div style={{ margin: "1rem 0" }}>
        <button
          onClick={() => setTab("my")}
          style={{ marginRight: 8, padding: "6px 10px", fontWeight: tab === "my" ? 700 : 400 }}
        >
          My Projects
        </button>
        <button
          onClick={() => setTab("add")}
          style={{ padding: "6px 10px", fontWeight: tab === "add" ? 700 : 400 }}
        >
          Add Project
        </button>
      </div>

      {/* Panels */}
      {tab === "my" ? (
        <div>
          <h2>My Projects</h2>

          {loading && <p>Loading…</p>}
          {error && <p style={{ color: "crimson" }}>{error}</p>}
          {!loading && !error && projects.length === 0 && <p>You have no projects yet.</p>}

          {!loading && !error && projects.map((p) => (
            <ProjectCard
              key={p.id}
              title={p.title}
              year={p.year}
              abstract={p.abstract}
              githubUrl={p.githubUrl}
              pdfUrl={p.pdfUrl}
              ownerName={p.owner?.fullName}
              isOwnerView
              onEdit={() => startEdit(p)}
              onDelete={() => startDelete(p)}
            />
          ))}
        </div>
      ) : (
        <div>
          <h2>Add Project</h2>
          <p>(Form will appear here in the next step.)</p>
        </div>
      )}
    </div>
  );
}
