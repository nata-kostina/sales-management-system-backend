import { BrandDto } from "../dtos/brand/brand.dto";
import { Brand } from "../models/brand/brand.model";
class BrandService {
    async getBrands() {
        const brands = await Brand.find();
        const brandsDtos = brands.map((brand) => new BrandDto(brand));
        return [...brandsDtos];
    }
}
export const brandService = new BrandService();
//# sourceMappingURL=brand.service.js.map