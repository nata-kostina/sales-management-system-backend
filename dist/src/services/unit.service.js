import { UnitDto } from "../dtos/unit/unit.dto";
import { Unit } from "../models/unit/unit.model";
class UnitService {
    async getUnits() {
        const units = await Unit.find();
        const unitsDtos = units.map((unit) => new UnitDto(unit));
        return [...unitsDtos];
    }
}
export const unitService = new UnitService();
//# sourceMappingURL=unit.service.js.map