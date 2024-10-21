import API from './axios'; 

export const register = ({username, password}) => {
    return API.post("auth/signup", {
        username,
        password, 
    });
};
