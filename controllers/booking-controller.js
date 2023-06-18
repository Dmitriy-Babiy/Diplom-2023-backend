import bookingModel from '../models/booking-model.js';
import bookingService from '../service/booking-service.js';

class BookingController {
    async create(req, res, next) {
        try {
            const { roomId } = req.params;
            const { checkInDate, checkOutDate, price } = req.body;
            const userId = req.user.id;
            const booking = await bookingService.create(roomId, userId, checkInDate, checkOutDate, price);
            return res.json(booking);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { bookingId } = req.params;
            await bookingService.delete(bookingId);
            return res.status(200).json({ message: 'Booking cancel' });
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const userId = req.user.id;
            const bookings = await bookingModel
                .find({ user: userId })
                .populate({
                    path: 'room',
                    select: '_id title',
                })
                .select('-__v')
                .lean();

            return res.json(bookings);
        } catch (error) {
            next(error);
        }
    }
}

export default new BookingController();
