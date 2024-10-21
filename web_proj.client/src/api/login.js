import API from './axios'; // імпортуємо вашу налаштування axios

export const signIn = ({username, password}) => {
    return API.post("auth/login", {
        username,
        password, 
    });
};
