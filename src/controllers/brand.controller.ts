import { NextFunction, Response, Request } from "express";
import { brandService } from "../services/brand.service";

class BrandController {
    public async getBrands(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const brandsData = await brandService.getBrands();
            res.json({
                brands: brandsData,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const brandController = new BrandController();
