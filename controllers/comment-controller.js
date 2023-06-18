import commentModel from '../models/comment-model.js';
import roomModel from '../models/room-model.js';
import commentService from '../service/comment-service.js';

class CommentController {
    async create(req, res, next) {
        try {
            const { roomId, rating, text } = req.body;
            const userId = req.user.id;

            const room = await commentService.create(userId, roomId, rating, text);

            return res.json(room);
        } catch (error) {
            next(error);
        }
    }

    // async update(req, res, next) {
    //     try {
    //         const { roomId, commentId } = req.params;
    //         rooms = await roomService.getOneRoom(id);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async delete(req, res, next) {
        try {
            const { commentId } = req.params;
            await commentService.delete(commentId);
            return res.status(200).json({ message: 'Comment delete' });
        } catch (error) {
            next(error);
        }
    }
}

export default new CommentController();
