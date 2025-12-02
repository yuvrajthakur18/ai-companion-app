import axios from "axios";

const API_URL = "https://ai-companion-app-pown.onrender.com"; // FastAPI render port

const api = axios.create({
  baseURL: API_URL,
});

export const register = async (username, password) => {
  return api.post("/register", { username, password });
};

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  const response = await axios.post(`${API_URL}/login`, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  localStorage.setItem("token", response.data.access_token);
  return response.data;
};

export const createCompanion = async (companion) => {
  const token = localStorage.getItem("token");
  return api.post("/companions/", companion, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getCompanions = async () => {
  const token = localStorage.getItem("token");
  return api.get("/companions/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const converse = async (companionId, message) => {
  const token = localStorage.getItem("token");
  return api.post(
    `/companions/${companionId}/converse`,
    { message },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
