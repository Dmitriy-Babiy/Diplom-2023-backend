import userModel from '../models/user-model.js';
import bcrypt from 'bcrypt';
import tokenService from './token-service.js';
import UserDto from '../dtos/user-dto.js';
import ApiError from '../exceptions/api-error.js';

class UserService {
    async registration(email, password, firstName, lastName) {
        const candidate = await userModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequestError(`Пользователь с почтовым адрессом ${email} уже существует`);
        }

        const hashPassword = await bcrypt.hashSync(password, 3);
        const user = await userModel.create({ firstName, lastName, email, password: hashPassword });

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async login(email, password) {
        const user = await userModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequestError(`Пользователь с почтовым адрессом ${email} не найден`);
        }

        const isPasswordEquals = await bcrypt.compareSync(password, user.password);
        if (!isPasswordEquals) {
            throw ApiError.BadRequestError(`Неверный пароль`);
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await userModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async getAllUsers() {
        const users = await userModel.find();
        return users;
    }
}

export default new UserService();
