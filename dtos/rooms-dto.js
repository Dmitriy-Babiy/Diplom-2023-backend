export default class RoomsDto {
    constructor(rooms) {
        return this.convertToDto(rooms);
    }

    convertToDto(rooms) {
        return rooms.map(room => {
            const { _id, ...roomData } = room.toObject();
            return { id: _id, ...roomData };
        });
    }
}