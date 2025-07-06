// Utility functions để xử lý cookie
  export const cookieUtils = {
    // Lấy cookie theo tên
    
    getCookie: (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    },

    // Xóa cookie
    deleteCookie: (name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },

    // Kiểm tra có  token không
    hasRefreshToken: () => {
      return !!cookieUtils.getCookie('Token');
    }
  };

  // Utility functions để xử lý token
  export const tokenUtils = {
    // Lưu access token vào localStorage
    setAccessToken: (token) => {
      if (token) {
        localStorage.setItem('accessToken', token);
      }
    },

    // Lấy access token từ localStorage
    getAccessToken: () => {
      return localStorage.getItem('accessToken');
      
    },

    // Xóa access token
    removeAccessToken: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },

    // Kiểm tra token có hết hạn không
    isTokenExpired: (token) => {
      if (!token) return true;
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
      } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
      }
    },

    // Lấy thông tin từ token
    getTokenPayload: (token) => {
      if (!token) return null;
      
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (error) {
        console.error('Error parsing token payload:', error);
        return null;
      }
    }
  };
