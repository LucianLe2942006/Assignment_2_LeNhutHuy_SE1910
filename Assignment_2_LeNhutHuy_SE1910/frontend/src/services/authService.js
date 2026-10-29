import axiosClient from "../api/axiosClient";

export const authService = {
  login: (email, password) => {
    return axiosClient.post("/auth/login", { email, password });
  }
};
