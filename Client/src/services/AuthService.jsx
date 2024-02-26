// AuthService.js

export const login = async (credentials) => {
    try {
      // Make a POST request to your server's authentication endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      
      // Store the JWT token in localStorage
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };
  
  export const logout = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem('token');
  };
  
  export const getToken = () => {
    // Retrieve the JWT token from localStorage
    return localStorage.getItem('token');
  };
  