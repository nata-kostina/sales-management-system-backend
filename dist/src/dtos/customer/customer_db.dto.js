export class CustomerDbDto {
    name;
    phone;
    email;
    country;
    state;
    city;
    address;
    deleted;
    constructor({ body }) {
        this.name = body.name;
        this.email = body.email;
        this.phone = body.phone;
        this.address = body.address;
        this.country = JSON.parse(body.country);
        this.state = JSON.parse(body.state);
        this.city = JSON.parse(body.city);
        this.deleted = false;
    }
}
//# sourceMappingURL=customer_db.dto.js.map