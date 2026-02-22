import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Vite Proxy 설정을 통해 백엔드로 연결
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
