import { tokenUtils } from "./tokenUtils";

export const getAuthHeaders = () => {
  const token = tokenUtils.getAccessToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};