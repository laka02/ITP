import axios from "axios";

// Get the base URL from environment variables or use a fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/salary`;

// Create an axios instance with configured defaults
const api = axios.create({
  baseURL: API_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      error.message = "Cannot connect to the server. Please check if the server is running at " + API_BASE_URL;
    }
    return Promise.reject(error);
  }
);

export const getAllSalaries = async () => api.get("/");
export const getSalaryById = async (id) => api.get(`/${id}`);
export const getSalariesByEmployee = async (employeeId) => api.get(`/employee/${employeeId}`);
export const calculateSalary = async (employeeId, salaryData) => api.post(`/calculate/${employeeId}`, salaryData);
export const updateSalary = async (id, salaryData) => api.put(`/update/${id}`, salaryData);
export const approveSalary = async (id) => api.put(`/approve/${id}`);
export const approveAttendance = async (id) => api.put(`/approve-attendance/${id}`);
export const generateSalaryReport = async (month, year) => api.get(`/report?month=${month}&year=${year}`);
export const generateSingleSalaryPDF = async (id) => api.get(`/pdf/${id}`);
