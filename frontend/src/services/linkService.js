import API from "../api";

export const getAllLinks = async () => {
  const res = await API.get("/api/links");
  return res.data;
};

export const createShortLink = async (url, customCode = null) => {
  const payload = { url };
  if (customCode && customCode.trim()) {
    payload.customCode = customCode.trim();
  }
  const res = await API.post("/api/links", payload);
  return res.data;
};

export const getLinkStats = async (code) => {
  const res = await API.get(`/api/links/${code}`);
  return res.data;
};

export const deleteLink = async (code) => {
  const res = await API.delete(`/api/links/${code}`);
  return res.data;
};