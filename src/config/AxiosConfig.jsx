import axios from "axios";

/**
 * Configuration for different environments
 * @typedef {Object} EnvironmentConfig
 * @property {string} development - Development environment API URL
 * @property {string} production - Production environment API URL
 */
const API_ENVIRONMENTS = {
  development: "http://localhost:8080/api",
  production: "https://your-production-api.com/api", // Replace with your production API URL
};

/**
 * Get the current environment
 * @returns {string} Current environment (development or production)
 */
const getCurrentEnvironment = () => {
  return import.meta.env.MODE || "development";
};

/**
 * Get the base URL for the current environment
 * @returns {string} Base URL for API requests
 */
const getBaseUrl = () => {
  const environment = getCurrentEnvironment();
  return API_ENVIRONMENTS[environment];
};

/**
 * Axios instance with default configuration
 * @type {import('axios').AxiosInstance}
 */
const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request interceptor
 * Adds authorization token and handles request configuration
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles common response scenarios and errors
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Handle different error status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // Handle forbidden access
          console.error("Forbidden access:", error.response.data);
          break;
        case 404:
          // Handle not found
          console.error("Resource not found:", error.response.data);
          break;
        case 500:
          // Handle server error
          console.error("Server error:", error.response.data);
          break;
        default:
          console.error("API Error:", error.response.data);
      }
    } else if (error.request) {
      // Handle network errors
      console.error("Network Error:", error.request);
    } else {
      // Handle other errors
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * API helper functions
 */
export const api = {
  /**
   * Send GET request
   * @param {string} url - API endpoint
   * @param {Object} [params] - Query parameters
   * @param {Object} [config] - Additional axios config
   * @returns {Promise<any>} Response data
   */
  get: (url, params = {}, config = {}) =>
    axiosInstance.get(url, { ...config, params }),

  /**
   * Send POST request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} [config] - Additional axios config
   * @returns {Promise<any>} Response data
   */
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),

  /**
   * Send PUT request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} [config] - Additional axios config
   * @returns {Promise<any>} Response data
   */
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),

  /**
   * Send DELETE request
   * @param {string} url - API endpoint
   * @param {Object} [config] - Additional axios config
   * @returns {Promise<any>} Response data
   */
  delete: (url, config = {}) => axiosInstance.delete(url, config),

  /**
   * Send PATCH request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} [config] - Additional axios config
   * @returns {Promise<any>} Response data
   */
  patch: (url, data = {}, config = {}) =>
    axiosInstance.patch(url, data, config),
};

export default api;
