export default class UserDto {
    email;
    id;

    constructor(model) {
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.email = model.email;
        this.id = model._id;
    }
}
