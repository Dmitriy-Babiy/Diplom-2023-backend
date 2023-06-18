import commentModel from '../models/comment-model.js';
import roomModel from '../models/room-model.js';

class CommentService {
    async create(userId, roomId, rating, text) {
        const room = await roomModel.findOne({ _id: roomId });

        if (room) {
            const comment = await commentModel.create({
                user: userId,
                rating,
                text,
            });
            const commentId = comment._id.toString();
            room.comments.push(commentId);
            await room.populate([{ path: 'comments', populate: { path: 'user', model: 'User' } }]);
            await room.save();
        }

        return room;
    }

    async delete(commentId) {
        await commentModel.deleteOne({ _id: commentId });
        return;
    }
}

export default new CommentService();
