  import apiClient from "./AxiosConfig";

  const authService = {
      register: async (data) => {
      
        const response = await apiClient.post("/Auth/register", data);
        console.log('ádasdattttttttdsadad',data)
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
     // 🔑 LẤY URL ĐĂNG NHẬP GOOGLE
  getGoogleLoginUrl: async () => {
    const response = await apiClient.get("/Auth/external-login");
    return response.data.loginUrl;
  },

  // ✅ XỬ LÝ CALLBACK TỪ GOOGLE TRẢ VỀ
  handleGoogleCallback: async () => {
    const response = await apiClient.get("/Auth/external-login-callback");
    return response.data;
  },
    };
    
    export default authService;