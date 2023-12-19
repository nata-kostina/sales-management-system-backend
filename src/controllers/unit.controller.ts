import { NextFunction, Response, Request } from "express";
import { unitService } from "../services/unit.service";

class UnitController {
    public async getUnits(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const unitsData = await unitService.getUnits();
            res.json({
                units: unitsData,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const unitController = new UnitController();
