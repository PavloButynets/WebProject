import API from './axios'; 

export const getNewsByAsset = (query) => {
    return API.get(`/assets/get-news-by-asset?${query}`);
};
