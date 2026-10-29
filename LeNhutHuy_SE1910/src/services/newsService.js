import axiosClient from "../api/axiosClient";

export const newsService = {
  getPublic: () => {
    return axiosClient.get("/news/public");
  },
  getAll: (search = "", categoryId = null, status = null) => {
    const params = {};
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    if (status !== null && status !== "") params.status = status;
    return axiosClient.get("/news", { params });
  },
  getHistory: (staffId) => {
    return axiosClient.get("/news/my-history", { params: { staffId } });
  },
  getById: (id) => {
    return axiosClient.get(`/news/${id}`);
  },
  create: (data, staffId) => {
    const params = staffId ? { staffId } : {};
    return axiosClient.post("/news", data, { params });
  },
  update: (id, data, staffId) => {
    const params = staffId ? { staffId } : {};
    return axiosClient.put(`/news/${id}`, data, { params });
  },
  delete: (id) => {
    return axiosClient.delete(`/news/${id}`);
  },
  getTags: () => {
    return axiosClient.get("/tags");
  }
};
