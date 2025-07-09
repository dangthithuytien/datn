import apiClient from "./AxiosConfig";

const authService = {
    register: async (data) => {
        console.log('ádasdasdasdsadad',data)
      const response = await apiClient.post("/Auth/register", data);
      return response.data;
    },
    confirmEmail: async ({ Email, Code }) => {
        const response = await apiClient.post("/Auth/confirm-email", {
          Email,
          Code,
        });
        return response.data;
      },
      
      resendOtp: async (Email) => {
        const response = await apiClient.post('/Auth/resend-otp', { Email });
        return response.data;
      },

      forgotPassword: async (Email) => {
        const response = await apiClient.post('/Auth/forgot-password', { Email });
        return response.data;
      },
      resetPassword: async ({ Email, Code, NewPassword }) => {
    const response = await apiClient.post("/Auth/reset-password", {
      Email,
      Code,
      NewPassword,
    });
    return response.data;
  },
  };
  
  export default authService;