export class CustomerDto {
    id;
    email;
    name;
    phone;
    country;
    state;
    city;
    address;
    constructor(model) {
        this.id = model._id.toString();
        this.name = model.name;
        this.email = model.email;
        this.country = {
            id: model.country.id,
            name: model.country.name,
        };
        this.state = {
            id: model.state.id,
            name: model.state.name,
        };
        this.phone = model.phone;
        this.city = {
            id: model.city.id,
            name: model.city.name,
        };
        this.address = model.address;
    }
}
//# sourceMappingURL=customer.dto.js.map