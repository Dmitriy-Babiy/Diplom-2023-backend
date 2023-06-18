import { Router } from 'express';
import bookingController from '../controllers/booking-controller.js';
import commentController from '../controllers/comment-controller.js';
import roomController from '../controllers/room-controller.js';
import userController from '../controllers/user-controller.js';
import authMiddleware from '../middleware/auth-middleware.js';
import { upload } from '../multer/index.js';
import { registerValidation } from '../validations/validation.js';

const router = new Router();

//JWT
router.post('/registration', registerValidation, userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
//Настройки пользователя
router.put('/updateAvatar', authMiddleware, userController.update);
//Пользователи
router.get('/users', authMiddleware, userController.getAll);
//Комнаты
router.post('/rooms', upload.array('images'), roomController.create); //Создание
router.get('/rooms', roomController.getAll); //Получить все
router.get('/rooms/:roomId', roomController.getOne); //Получиь одну
//Комментарии для комнат
router.post('/comment', authMiddleware, commentController.create); //Создать
// router.put('/rooms/:roomId/:commentId', authMiddleware, commentController.update); //Обновить
router.delete('/comment/:commentId', authMiddleware, commentController.delete); //Удалить
//Бронирование
// router.get('/bookings/', bookingController.getAll); // Получить все бронирования
router.get('/bookings/:userId', authMiddleware, bookingController.getOne); // Получить все бронирования пользователя
router.post('/booking/:roomId/:userId', authMiddleware, bookingController.create); // Создать бронирование
router.delete('/booking/:bookingId', authMiddleware, bookingController.delete); // Удалить бронирование
export default router;
