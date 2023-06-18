import bcrypt from 'bcrypt';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import UserDto from '../dtos/user-dto.js';
import ApiError from '../exceptions/api-error.js';
import userModel from '../models/user-model.js';
import tokenService from './token-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class UserService {
    async registration(email, password, firstName, lastName) {
        const candidate = await userModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequestError(`User with email address ${email} already exists`);
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
            throw ApiError.BadRequestError(`Incorrect email`);
        }

        const isPasswordEquals = await bcrypt.compareSync(password, user.password);
        if (!isPasswordEquals) {
            throw ApiError.BadRequestError(`Incorrect password`);
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

    async updateAvatar(email, avatarBase64) {
        const buf = new Buffer.from(avatarBase64, 'base64');
        const avatarUrl = `${Date.now().toString()}.png`;
        const infoUser = await userModel.findOne({ email });

        if (infoUser.avatar) {
            fs.unlink(__dirname + `/../public/${infoUser.avatar}`, () => {});
        }

        fs.writeFile(__dirname + `/../public/${avatarUrl}`, buf, () => {});

        const user = await userModel.findOneAndUpdate({ email }, { avatar: avatarUrl }, { new: true }).then((updatedUser) => {
            return updatedUser;
        });

        const userDto = new UserDto(user);
        return { user: userDto };
    }
}

export default new UserService();
