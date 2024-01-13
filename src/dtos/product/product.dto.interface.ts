import { IImage } from "../../types";
import { IBrandDto } from "../brand/brand.dto.interface";
import { ICategoryDto } from "../category/category.dto.interface";
import { IUnitDto } from "../unit/unit.dto.interface";

export interface IProductDto {
    id: string;
    name: string;
    sku: string | null;
    brand: IBrandDto | null;
    price: number;
    quantity: number;
    images: IImage[];
    unit: IUnitDto | null;
    description: string | null;
    categories: ICategoryDto[];
}
