import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ UPLOAD CSV
export const uploadFeedback = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload-feedback", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ✅ SENTIMENT SUMMARY
export const getSentimentSummary = async () => {
  const response = await api.get("/sentiment-summary");
  return response.data;
};

// ✅ KEYWORDS
export const getKeywords = async (limit = 10) => {
  const response = await api.get(`/keywords?limit=${limit}`);
  return response.data;
};

// ✅ SAMPLE FEEDBACK
export const getSampleFeedback = async (limit = 50) => {
  const response = await api.get(`/sample-feedback?limit=${limit}`);
  return response.data;
};
