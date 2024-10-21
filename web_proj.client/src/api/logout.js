import API from './axios'; 


export const logoutUser = () => {
    return API.post("auth/logout"); 
};