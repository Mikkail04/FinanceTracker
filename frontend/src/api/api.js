import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

export const getSummary = () => API.get("/analytics/summary");
export const getTransactions = () => API.get("/transactions");
export const getSubscriptions = () => API.get("/subscriptions");

export const deleteTransaction = (id) =>
  API.delete(`/transactions/${id}`);

export const updateTransaction = (id, data) =>
  API.put(`/transactions/${id}`, data);