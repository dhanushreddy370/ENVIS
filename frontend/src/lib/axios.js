import axios from "axios";

// Automatically detects if we are in Dev (localhost:5000) or Prod
// Note: Vite uses import.meta.env
// We use relative path so Vite proxy handles the cross-origin in Dev
const BASE_URL = "/api";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true // Important if we add auth later
});
