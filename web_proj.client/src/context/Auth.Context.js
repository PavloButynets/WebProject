import React, { createContext, useContext, useState } from 'react';
import { logoutUser } from '../api/logout';
// Створення контексту
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        try {
            const response = await logoutUser(); 
            if (response.data.success) {
                localStorage.removeItem('token'); 
                setIsLoggedIn(false); 
            } else {
                console.error(response.data.message || "Logout failed");
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
        }
    };
    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Користувацький хук для доступу до контексту
export const useAuth = () => useContext(AuthContext);
