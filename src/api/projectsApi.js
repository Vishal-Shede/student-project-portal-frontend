import axiosClient from "./axiosClient";

/**
 * PUBLIC: list all projects (used by Home)
 */
export async function listAll() {
  const res = await axiosClient.get("/projects");
  return Array.isArray(res.data) ? res.data : [];
}

/**
 * AUTH: list only my projects (Dashboard)
 */
export async function listMine() {
  const res = await axiosClient.get("/me/projects");
  return Array.isArray(res.data) ? res.data : [];
}

/**
 * AUTH: create a new project
 * payload shape:
 * {
 *   title: string,
 *   year: number,
 *   abstract: string,
 *   githubUrl?: string,
 *   pdfUrl?: string
 * }
 */
export async function createProject(payload) {
  const res = await axiosClient.post("/me/projects", payload);
  return res.data; // created project
}

/**
 * AUTH: update an existing project
 */
export async function updateProject(id, payload) {
  const res = await axiosClient.put(`/me/projects/${id}`, payload);
  return res.data; // updated project
}

/**
 * AUTH: delete a project
 */
export async function deleteProject(id) {
  await axiosClient.delete(`/me/projects/${id}`);
  return true;
}
