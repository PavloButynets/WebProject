import API from './axios'; 

export const test = () => {
    return API.get('/test');
};
