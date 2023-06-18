import mongoose, { Schema } from 'mongoose';

const RoomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    numberOfBeds: {
        type: Number,
        required: true,
    },
    numberOfPersons: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    services: {
        type: [Object],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
    comments: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        default: [],
    },
});

export default mongoose.model('Room', RoomSchema);
