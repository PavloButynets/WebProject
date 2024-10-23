import axios from "axios";
const baseURL = "http://localhost:3001/api"

const API = axios.create({
    baseURL,
    withCredentials: true,
  });
  
  API.interceptors.request.use(
    function (req) {
        const token = localStorage.getItem("token");
      if (token) req.headers["Authorization"] = `Bearer ${token}`;
      return req;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  API.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && 
            (error.response.data.message === "jwt expired" || error.response.data.message === "Token missing")) {
            try {
                const response = await API.post('/auth/refresh-token', {}, { withCredentials: true });
                if (response.data.success) {
                    const newToken = response.data.token;
                    localStorage.setItem('token', newToken);

                    API.defaults.headers['Authorization'] = newToken;
                    originalRequest.headers['Authorization'] = newToken;

                    return API(originalRequest);
                }
                else{
                    localStorage.removeItem('token'); 
                    alert('Refresh token expired. Please log in again.');
                
                    window.location.href = '/login';
                    return Promise.reject(new Error('Refresh token expired. Please log in again.'));
                }
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                alert('Error refreshing token. Please log in again.');
                
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);


  export default API;
