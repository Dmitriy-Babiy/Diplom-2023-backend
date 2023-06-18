export default class UserDto {
    email;
    id;

    constructor(model) {
        this.id = model._id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.email = model.email;
        this.avatar = model.avatar;
    }
}
