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
  // TEMP: hardcoded example just to see the card UI
  const demo = {
    title: "TalkingTree 2.0",
    year: 2025,
    abstract:
      "VR + AI group discussion trainer for ESL learners. Practice with unscripted avatars, get feedback, and build confidence.",
    githubUrl: "https://github.com/example/talkingtree",
    pdfUrl: "https://example.com/paper.pdf",
    ownerName: "Vishal Shede",
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>All Projects</h1>
      <ProjectCard {...demo} />
    </div>
  );
}


export default Home;
