import { validationResult } from 'express-validator';
import userService from '../service/user-service.js';
import ApiError from '../exceptions/api-error.js';

//функции что передаются в router

class UserController {
    async registration(req, res, next) {
        try {
            const errorsValidation = validationResult(req);
            if (!errorsValidation.isEmpty()) {
                return next(ApiError.BadRequestError('Ошибка при валидации', errorsValidation.array()));
            }
            const { email, password, firstName, lastName } = req.body;
            const userData = await userService.registration(email, password, firstName, lastName);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { email } = req.user;
            const avatarBase64 = req.body.avatar.replace(/^data:image\/\w+;base64,/, '');
            const user = await userService.updateAvatar(email, avatarBase64);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
