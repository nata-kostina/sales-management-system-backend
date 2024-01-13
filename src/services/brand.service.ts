import { BrandDto } from "../dtos/brand/brand.dto";
import { Brand } from "../models/brand/brand.model";

class BrandService {
    public async getBrands(): Promise<BrandDto[]> {
        const brands = await Brand.find();
        const brandsDtos: BrandDto[] = brands.map(
            (brand) => new BrandDto(brand),
        );
        return [...brandsDtos];
    }

    public async getBrandList(): Promise<BrandDto[]> {
        const brands = await Brand.find({}, "name");
        const brandsDtos: BrandDto[] = brands.map(
            (brand) => new BrandDto(brand),
        );
        return [...brandsDtos];
    }
}

export const brandService = new BrandService();
