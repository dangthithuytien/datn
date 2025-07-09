export const tokenUtils = {
    setAccessToken: (token) => {
      if (token) localStorage.setItem('accessToken', token);
    },
  
    getAccessToken: () => {
      return localStorage.getItem('accessToken');
    },
  
    removeAccessToken: () => {
      localStorage.removeItem('accessToken');
    },
  
    isTokenExpired: (token) => {
      if (!token) return true;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Date.now() / 1000;
      } catch {
        return true;
      }
    },
  
    getTokenPayload: (token) => {
      if (!token) return null;
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch {
        return null;
      }
    }
  };