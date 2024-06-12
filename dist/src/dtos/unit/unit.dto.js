export class UnitDto {
    id;
    name;
    constructor(model) {
        this.id = model._id.toString();
        this.name = model.name;
    }
}
//# sourceMappingURL=unit.dto.js.map