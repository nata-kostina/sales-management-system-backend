import bcrypt from "bcryptjs";
import { User } from "../models/user/user.model";
import { tokenService } from "./token.service";
import { UserDto } from "../dtos/user/user.dto";
import { ApiError } from "../exceptions/api.error";

class UserService {
    public async register(
        email: string,
        password: string
    ): Promise<{
        user: UserDto;
        accessToken: string;
        refreshToken: string;
    }> {
        const candidate = await User.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(
                "The user with such email already exists"
            );
        }
        const hashPassword = await bcrypt.hash(password, 7);
        const user = await User.create({ email, password: hashPassword });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        };
    }

    public async login(
        email: string,
        password: string
    ): Promise<{
        user: UserDto;
        accessToken: string;
        refreshToken: string;
    }> {
        const user = await User.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest("User with such email is not found");
        }

        const arePasswordsEqual = bcrypt.compareSync(password, user.password);
        if (!arePasswordsEqual) {
            throw ApiError.BadRequest("Incorrect password");
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        };
    }

    public async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    public async refreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        };
    }

    public async getUsers() {
        const users = await User.find();
        return users;
    }
}

export const userService = new UserService();
