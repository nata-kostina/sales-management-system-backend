import jwt from "jsonwebtoken";
import { Token } from "../models/token/token.model";
import { ITokenPayload } from "../types";

class TokenService {
    public validateAccessToken(token: string): ITokenPayload {
        try {
            const userData = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            return userData as ITokenPayload;
        } catch (error) {
            return null;
        }
    }

    public validateRefreshToken(token: string): ITokenPayload {
        try {
            const userData = jwt.verify(token, process.env.SECRET_REFRESH_KEY);
            return userData as ITokenPayload;
        } catch (error) {
            return null;
        }
    }

    public generateTokens(payload: ITokenPayload) {
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

    public async saveToken(userId: string, refreshToken: string) {
        const tokenData = await Token.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({ user: userId, refreshToken });
        return token;
    }

    public async removeToken(refreshToken: string) {
        const tokenData = await Token.deleteOne({ refreshToken });
        return tokenData;
    }

    public async findToken(refreshToken: string) {
        const tokenData = await Token.findOne({ refreshToken });
        return tokenData;
    }
}

export const tokenService = new TokenService();
