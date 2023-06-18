import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
    },
    price: {
        type: Number,
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    isPayment: {
        type: Boolean,
        default: false,
    },
});
export default mongoose.model('Booking', bookingSchema);
