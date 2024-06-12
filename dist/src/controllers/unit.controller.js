import { unitService } from "../services/unit.service";
class UnitController {
    async getUnits(req, res, next) {
        try {
            const unitsData = await unitService.getUnits();
            res.json({ units: unitsData });
        }
        catch (error) {
            next(error);
        }
    }
}
export const unitController = new UnitController();
//# sourceMappingURL=unit.controller.js.map