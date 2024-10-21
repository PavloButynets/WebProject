const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateUser = require("../utils/validateUser");
const User = require('../models/user.model');
const { logger } = require("../utils/logger");

class AuthService {
    async signUp(user) {
        try {
            const { password, username } = user;
            if (!password || !username) {
                return { status: 400, message: "All fields required" };
            }

            if (validateUser(username, password)) {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password, salt);

                const existingUser = await User.findOne({ username });

                if (existingUser) {
                    return { status: 401, message: "Username taken already" };
                }

                const newUser = await User.create({
                    ...user,
                    password: hashedPassword,
                });

                const token = await this.signToken({
                    id: newUser._id,
                    username: newUser.username,
                });

                const refreshToken = await this.signRefreshToken({
                    id: newUser._id,
                    username: newUser.username,
                });

                return {

                    token,
                    refreshToken,
                    user: {
                        user_id: newUser._id,
                        username: newUser.username,
                    },
                };
            } else {
                return { status: 401, message: "Input validation error" };
            }
        } catch (error) {
            logger.error(error.message);

            return { status: error.statusCode || 500, message: error.message || "Internal server error" };
        }
    }

    async login(username, password) {
        try {

            const user = await User.findOne({ username });

            if (!user) {
                return { status: 401, message: "Username or password incorrect." };
            }

            const isCorrectPassword = await bcrypt.compare(password, user.password);

            if (!isCorrectPassword) {
                return { status: 401, message: "Username or password incorrect." };
            }

            const token = await this.signToken({ id: user._id, username: user.username });

            const refreshToken = await this.signRefreshToken({
                id: user._id,
                username: user.username,
            });

            return {
                token,
                refreshToken,
                user: {
                    user_id: user._id,
                    username: user.username,
                },
            };
        } catch (error) {
            logger.error(error.message);
            return { status: error.statusCode || 500, message: error.message || "Internal server error" };
        }
    }

    async generateToken(data) {
        try {
            const payload = await this.verifyRefreshToken(data);
            if (payload.status) {
                return { status: 401, message: "Refresh token expired. Please log in again." };
            }
            const token = await this.signToken(payload);
            return { token };
        } catch (error) {
            if (error.message.includes('jwt expired11')) {
                return { status: 401, message: "Refresh token expired. Please log in again." };
            }
            logger.error(error.message);
            return { status: 500, message: error.message };
        }
    }

    async signToken(data) {
        try {
            return jwt.sign(data, process.env.SECRET, { expiresIn: "20s" });
        } catch (error) {
            logger.error(error.message);
            return { status: 500, message: "An error occurred while signing the token" };
        }
    }

    async signRefreshToken(data) {
        try {
            return jwt.sign(data, process.env.REFRESH_SECRET, { expiresIn: "21s" });
        } catch (error) {
            logger.error(error.message);
            return { status: 500, message: "An error occurred while signing the refresh token" };
        }
    }

    async verifyRefreshToken(token) {
        try {
            const payload = jwt.verify(token, process.env.REFRESH_SECRET);
            return {
                id: payload.id,
                username: payload.username,
            };
        } catch (error) {
            logger.error(error.message);
            return { status: 500, message: error.message };

        }
    }
}

module.exports = new AuthService();
