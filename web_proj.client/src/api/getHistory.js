import API from './axios'; 

export const getHistory = (query) => {
    return API.get(`/assets/history?asset=${query}`);
};
