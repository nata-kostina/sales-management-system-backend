import jwt from "jsonwebtoken";
import { Token } from "../models/token/token.model";
class TokenService {
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            return userData;
        }
        catch (error) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_REFRESH_KEY);
            return userData;
        }
        catch (error) {
            return null;
        }
    }
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, {
            expiresIn: "5h",
        });
        const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, {
            expiresIn: "30d",
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({ user: userId, refreshToken });
        return token;
    }
    async removeToken(refreshToken) {
        const tokenData = await Token.deleteOne({ refreshToken });
        return tokenData;
    }
    async findToken(refreshToken) {
        const tokenData = await Token.findOne({ refreshToken });
        return tokenData;
    }
}
export const tokenService = new TokenService();
//# sourceMappingURL=token.service.js.map