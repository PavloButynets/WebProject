const authService = require("../services/auth.service");

const createAccount = async (req, res) => {
    try {
        const result = await authService.signUp(req.body);
        if (result.status) {
            return res.status(result.status).json({
                success: false,
                message: result.message,
            });
        }

        const { token, refreshToken, user } = result;

        res.header("auth-token", token);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
            secure: process.env.NODE_ENV !== "development",
        });
        return res.status(201).json({
            success: true,
            token,
            user,
        });
    } catch (error) {
        return res.status(500).json({

            success: false,
            message: "Internal server error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);

        if (result.status) {
            return res.status(result.status).json({
                success: false,
                message: result.message,
            });
        }

        const { token, refreshToken, user } = result;

        res.header("auth-token", token);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
            secure: process.env.NODE_ENV !== "development",
        });

        return res.status(200).json({
            success: true,
            token,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
const logoutUser = (req, res) => {
    try {

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
            secure: process.env.NODE_ENV !== "development",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        if (!req.cookies.refreshToken) {
            return res.status(401).json({ message: "Refresh token missing" });
        }
        const result = await authService.generateToken(req.cookies.refreshToken);
        if (result.status === 401) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
                secure: process.env.NODE_ENV !== "development",
            });
            return res.status(401).json({
                success: false,
                message: result.message, 
            });
        }
        return res.json({ 
            success: true,
            token: result.token 
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    createAccount,
    loginUser,
    refreshToken,
    logoutUser,
};
