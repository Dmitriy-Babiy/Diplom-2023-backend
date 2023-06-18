import mongoose, { Schema } from 'mongoose';
import roomModel from './room-model.js';

const CommentSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    rating: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

CommentSchema.pre('deleteOne', async function (next) {
    const comment = this;
    const commentId = comment.getQuery()._id;

    try {
        const room = await roomModel.findOne({ comments: commentId });

        if (room) {
            room.comments.pull(commentId);
            await room.save();
        }

        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('Comment', CommentSchema);
