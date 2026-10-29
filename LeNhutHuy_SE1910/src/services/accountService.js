import axiosClient from "../api/axiosClient";

export const accountService = {
  getAll: (search = "") => {
    const params = search ? { search } : {};
    return axiosClient.get("/accounts", { params });
  },
  getById: (id) => {
    return axiosClient.get(`/accounts/${id}`);
  },
  create: (data) => {
    return axiosClient.post("/accounts", data);
  },
  update: (id, data) => {
    return axiosClient.put(`/accounts/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/accounts/${id}`);
  }
};
