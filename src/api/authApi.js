import axiosClient from './axiosClient';

// POST /auth/register  -> { id, fullName, email } on success
export async function register({ fullName, email, password }) {
  const res = await axiosClient.post('/auth/register', { fullName, email, password });
  return res.data;
}

// POST /auth/login  -> { token, user: { id, fullName, email } }
export async function login({ email, password }) {
  const res = await axiosClient.post('/auth/login', { email, password });
  return res.data;
}
