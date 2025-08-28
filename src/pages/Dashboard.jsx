import { useState } from "react";

export default function Dashboard() {
  const [tab, setTab] = useState("my"); // "my" | "add"

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
          <p>(List will load here in Step 3)</p>
        </div>
      ) : (
        <div>
          <h2>Add Project</h2>
          <p>(Form will appear here in Step 4)</p>
        </div>
      )}
    </div>
  );
}
