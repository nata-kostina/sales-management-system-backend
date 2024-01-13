import { UnitDto } from "../dtos/unit/unit.dto";
import { Unit } from "../models/unit/unit.model";

class UnitService {
    public async getUnits(): Promise<UnitDto[]> {
        const units = await Unit.find();
        const unitsDtos: UnitDto[] = units.map((unit) => new UnitDto(unit));
        return [...unitsDtos];
    }

    public async getUnitList(): Promise<UnitDto[]> {
        const units = await Unit.find({}, "name");
        const unitsDtos: UnitDto[] = units.map(
            (unit) => new UnitDto(unit),
        );
        return [...unitsDtos];
    }
}

export const unitService = new UnitService();
