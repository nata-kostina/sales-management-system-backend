import { brandService } from "../services/brand.service";
class BrandController {
    async getBrands(req, res, next) {
        try {
            const brandsData = await brandService.getBrands();
            res.json({
                brands: brandsData,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export const brandController = new BrandController();
//# sourceMappingURL=brand.controller.js.map