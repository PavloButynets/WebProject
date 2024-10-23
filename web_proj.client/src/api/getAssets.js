import API from './axios'; 

export const getAssets = (params) => {
    const query = new URLSearchParams(params).toString();
    return API.get(`/assets/get-assets?${query}`);
};
