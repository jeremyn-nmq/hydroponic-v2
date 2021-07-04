export class Account {
    constructor(data) {
        this.email = data.key;
        this.name = data.name;
        this.password = data.password.toString();
        this.role = data.role;
        this.access = data.access;
    }
}