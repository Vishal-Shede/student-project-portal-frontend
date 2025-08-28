import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import { listMine, deleteProject } from "../api/projectsApi";

export default function Dashboard() {
  const [tab, setTab] = useState("my"); // "my" | "add"

  // list state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // edit state
  const [editingProject, setEditingProject] = useState(null);
  const isEditMode = Boolean(editingProject);

  // load on "my" tab
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
        } catch {
          if (active) setError("Failed to load your projects.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMine();
    return () => { active = false; };
  }, [tab]);

  // owner actions
  function startEdit(p) {
    setEditingProject(p);
    setTab("add"); // open form in edit mode
  }

  async function startDelete(p) {
    const sure = window.confirm(`Delete "${p.title}"? This cannot be undone.`);
    if (!sure) return;
    try {
      await deleteProject(p.id);
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
      alert("Deleted.");
    } catch (err) {
      alert("Failed to delete. Please try again.");
    }
  }

  // when form saves successfully
  function handleSaved(saved) {
    if (isEditMode) {
      setProjects((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      setEditingProject(null);
    } else {
      setProjects((prev) => [saved, ...prev]);
    }
    setTab("my");
    alert(isEditMode ? "Updated!" : "Created!");
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Dashboard</h1>

      {/* Tabs */}
      <div style={{ margin: "1rem 0" }}>
        <button
          onClick={() => { setTab("my"); setEditingProject(null); }}
          style={{ marginRight: 8, padding: "6px 10px", fontWeight: tab === "my" ? 700 : 400 }}
        >
          My Projects
        </button>
        <button
          onClick={() => { setTab("add"); setEditingProject(null); }}
          style={{ padding: "6px 10px", fontWeight: tab === "add" ? 700 : 400 }}
        >
          {isEditMode ? "Edit Project" : "Add Project"}
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
          <h2>{isEditMode ? "Edit Project" : "Add Project"}</h2>
          <ProjectForm
            initialData={editingProject}
            onSaved={handleSaved}
            onCancel={() => { setEditingProject(null); setTab("my"); }}
          />
        </div>
      )}
    </div>
  );
}
