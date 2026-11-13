import api from "./axios";

export const getProducts = async () => (await api.get("/products")).data;
export const getProduct = async (id) => (await api.get(`/products/${id}`)).data;
export const createProduct = async (data) => (await api.post("/products", data)).data;
export const updateProduct = async (id, data) => (await api.put(`/products/${id}`, data)).data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;