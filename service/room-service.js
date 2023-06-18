import RoomsDto from '../dtos/rooms-dto.js';
import roomModel from '../models/room-model.js';

class RoomService {
    async getAllRooms() {
        const rooms = await roomModel.find().populate('comments');
        return rooms;
    }

    async getOneRoom(_id) {
        const room = await roomModel
            .findById({ _id })
            .select('-__v')
            .populate([
                {
                    path: 'comments',
                    select: 'rating text createdAt',
                    populate: { path: 'user', model: 'User', select: 'id avatar firstName lastName' },
                },
            ]);
        return room;
    }
}

export default new RoomService();
