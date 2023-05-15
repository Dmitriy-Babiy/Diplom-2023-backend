import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
  body('firstName', 'Укажите имя').isLength({ min: 3 }),
  body('lastName', 'Укажите фамилию').isLength({ min: 3 }),
  // body('imageUrl', 'Неверня ссылка на аватарку').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Неверный формат пароля').isLength({ min: 5 }),
];

export const roomCreateValidation = [
  body('title', 'Короткий заголовок').isLength({ min: 5 }).isString(),
  body('description', 'Короткое описание').isLength({ min: 10 }).isString(),
];
