import { useEffect, useState } from "react";
import { createProject, updateProject } from "../api/projectsApi";

export default function ProjectForm({ initialData = null, onSaved, onCancel }) {
  const isEdit = Boolean(initialData?.id);
  const currentYear = new Date().getFullYear();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [year, setYear] = useState(initialData?.year ?? currentYear);
  const [abstract, setAbstract] = useState(initialData?.abstract ?? "");
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl ?? "");
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // when switching from Add -> Edit (or different project), refresh fields
  useEffect(() => {
    setTitle(initialData?.title ?? "");
    setYear(initialData?.year ?? currentYear);
    setAbstract(initialData?.abstract ?? "");
    setGithubUrl(initialData?.githubUrl ?? "");
    setPdfUrl(initialData?.pdfUrl ?? "");
    setError("");
  }, [initialData]);

  function validate() {
    if (title.trim().length < 3) return "Title must be at least 3 characters.";
    const y = Number(year);
    if (!Number.isInteger(y) || y < 2000 || y > currentYear + 1)
      return `Year must be between 2000 and ${currentYear + 1}.`;
    if (abstract.trim().length < 10) return "Abstract must be at least 10 characters.";
    const ok = (u) => !u || /^https?:\/\/\S+$/i.test(u);
    if (!ok(githubUrl)) return "GitHub URL must start with http(s)://";
    if (!ok(pdfUrl)) return "PDF URL must start with http(s)://";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setSaving(true);
    setError("");
    const payload = {
      title: title.trim(),
      year: Number(year),
      abstract: abstract.trim(),
      githubUrl: githubUrl.trim() || undefined,
      pdfUrl: pdfUrl.trim() || undefined,
    };

    try {
      const saved = isEdit
        ? await updateProject(initialData.id, payload)
        : await createProject(payload);

      onSaved?.(saved); // parent decides how to refresh list/UI

      if (!isEdit) {
        // clear for next add
        setTitle("");
        setYear(currentYear);
        setAbstract("");
        setGithubUrl("");
        setPdfUrl("");
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400) setError(err?.response?.data?.message || "Invalid input.");
      else if (status === 401 || status === 403) setError("Please log in again.");
      else setError("Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 560 }}>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ marginBottom: 12 }}>
        <label>Title</label><br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title"
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Year</label><br />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min={2000}
          max={currentYear + 1}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Abstract</label><br />
        <textarea
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          placeholder="Short summary of your project"
          rows={5}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>GitHub URL (optional)</label><br />
        <input
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/..."
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>PDF URL (optional)</label><br />
        <input
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          placeholder="https://.../paper.pdf"
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div>
        <button disabled={saving} style={{ padding: "8px 14px", marginRight: 8 }}>
          {saving ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update" : "Create")}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ padding: "8px 14px" }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
