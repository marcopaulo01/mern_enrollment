// ApiClient.js

import { getToken } from './AuthService';

export const fetchData = async () => {
  try {
    const token = getToken();
    const response = await fetch('/api/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
