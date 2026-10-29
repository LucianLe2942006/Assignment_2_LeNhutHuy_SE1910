import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor xu ly ket qua tra ve va thong bao loi
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
