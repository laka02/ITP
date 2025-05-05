import axios from "axios";

// Get the base URL from environment variables or use a fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/employee`;

// Create an axios instance with configured defaults
const api = axios.create({
  baseURL: API_URL,
  timeout: 6000, // Increased timeout to 8 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handling interceptor with more detailed error logging
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error Details:", {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.code === "ERR_NETWORK") {
      error.message = "Cannot connect to the server. Please check if the server is running at " + API_BASE_URL;
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const getEmployees = async () => api.get("/");
export const getEmployeeById = async (id) => api.get(`/${id}`);
export const addEmployee = async (employee) => api.post("/add", employee);
export const updateEmployee = async (id, employee) => api.put(`/update/${id}`, employee);
export const deleteEmployee = async (id) => api.delete(`/delete/${id}`);

// Helper function to check if API is reachable
export const checkApiConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return { connected: true, data: response.data };
  } catch (error) {
    return { connected: false, error };
  }
};
