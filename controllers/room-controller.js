import roomModel from '../models/room-model.js';
import roomService from '../service/room-service.js';

class RoomController {
    async getAll(req, res, next) {
        try {
            const rooms = await roomService.getAllRooms();
            return res.json(rooms);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const { roomId } = req.params;
            const room = await roomService.getOneRoom(roomId);
            return res.json(room);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { title, price, discount, description, numberOfBeds, numberOfPersons, services } = req.body;
            const imagesPath = [];
            const servicesArray = JSON.parse(services);
           
            req.files.map((file) => {
                imagesPath.push(file.filename);
            });

            const room = await roomModel.create({
                title,
                price,
                discount,
                description,
                numberOfBeds,
                numberOfPersons,
                images: imagesPath,
                services: servicesArray,
            });
            return res.json(room);
        } catch (error) {
            next(error);
        }
    }
}

export default new RoomController();
