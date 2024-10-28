import API from './axios'; 

export const getStatus = (query) => {
    return API.get(`/assets/status?asset=${query}`);
};
