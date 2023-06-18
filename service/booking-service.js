import ApiError from '../exceptions/api-error.js';
import bookingModel from '../models/booking-model.js';

class BookingService {
    async create(roomId, userId, checkInDate, checkOutDate, price) {
        const existingBooking = await bookingModel.findOne({
            room: roomId,
            $or: [
                { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
                { checkInDate: { $gte: checkInDate, $lt: checkOutDate } },
                { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } },
                { checkInDate: { $eq: checkOutDate }, checkOutDate: { $eq: checkInDate } },
                { checkOutDate: { $eq: checkInDate } },
            ],
        });

        if (existingBooking) {
            throw ApiError.BadRequestError('Номер уже занят в указанный период времени.');
        }

        if (checkInDate == checkOutDate) {
            throw ApiError.BadRequestError('Минимальное бронирование для номера 1 день.');
        }

        const booking = await bookingModel.create({
            user: userId,
            room: roomId,
            price,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
        });
        return booking;
    }

    async delete(bookingId) {
        const booking = await bookingModel.deleteOne({ _id: bookingId });
        return booking;
    }
}

export default new BookingService();
