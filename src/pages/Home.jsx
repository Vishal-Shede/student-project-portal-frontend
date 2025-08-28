import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import ProjectCard from "../components/ProjectCard";

/**
 * API: GET /projects
 * Returns: Array<Project>
 * Project shape:
 * {
 *   id: number | string,
 *   title: string,
 *   year: number,
 *   abstract: string,
 *   githubUrl?: string,
 *   pdfUrl?: string,
 *   owner?: { id: number | string, fullName: string }
 * }
 * UI defaults:
 * - title -> "Untitled"
 * - year -> "—"
 * - abstract -> "No abstract provided."
 * - ownerName -> owner?.fullName || "Unknown"
 */

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Real Fetch
  useEffect(() => {
    let active = true; // avoid state update after unmount

    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await axiosClient.get("/projects");
        if (!active) return;

        // Expecting an array; if backend returns something else, coerce safely
        const data = Array.isArray(res.data) ? res.data : [];
        setProjects(data);
      } catch (err) {
        console.error("GET /projects failed:", err);
        if (!active) return;
        setError("Failed to load projects.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  //Mock fetch
//   useEffect(() => {
//   let active = true;
//   async function loadMock() {
//     setLoading(true);
//     setError("");
//     try {
//       const mod = await import("../data/projects.sample.json");
//       if (active) setProjects(mod.default || []);
//     } catch (e) {
//       console.error(e);
//       if (active) setError("Failed to load local mock.");
//     } finally {
//       if (active) setLoading(false);
//     }
//   }
//   loadMock();
//   return () => { active = false; };
// }, []);


  if (loading) return <div style={{ padding: "1rem" }}>Loading projects…</div>;
  if (error) return <div style={{ padding: "1rem", color: "crimson" }}>{error}</div>;
  if (projects.length === 0) return <div style={{ padding: "1rem" }}>No projects yet.</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>All Projects</h1>
      {projects.map((p) => (
        <ProjectCard
          key={p.id}
          title={p.title}
          year={p.year}
          abstract={p.abstract}
          githubUrl={p.githubUrl}
          pdfUrl={p.pdfUrl}
          ownerName={p.owner?.fullName}
        />
      ))}
    </div>
  );
}

export default Home;
