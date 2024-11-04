import API from './axios'; 

export const cancelAnalysis  = (query) => {
    return API.delete(`/assets/cancel?asset=${query}`);
};
