import { Types } from "mongoose";
import { IProductDto } from "./product.dto.interface";
import { IProduct } from "../../models/product/product.interface";
import { PopulatedProduct } from "../../models/product/product.model";
import { IBrandDto } from "../brand/brand.dto.interface";
import { IUnitDto } from "../unit/unit.dto.interface";
import { ICategoryDto } from "../category/category.dto.interface";
import { ImageDto } from "../image/image.dto";
import { IImageDto } from "../image/image.dto.interface";

export class ProductDto implements IProductDto {
    public id: string;
    public name: string;
    public brand: IBrandDto | null;
    public unit: Omit<IUnitDto, "priority"> | null;
    public sku: string;
    public price: number;
    public quantity: number;
    public images: IImageDto[];
    public categories: (Omit<ICategoryDto, "deleted">)[] | null;
    public description: string;

    public constructor(
        model: Omit<IProduct & { _id: Types.ObjectId; }, "brand" | "unit" | "categories"> & PopulatedProduct,
    ) {
        this.id = model._id.toString();
        this.name = model.name;
        this.brand = model.brand ? {
            id: model.brand._id.toString(),
            name: model.brand.name,
        } : null;
        this.price = model.price;
        this.images = model.images.map((image) => new ImageDto(image));
        this.quantity = model.quantity;
        this.sku = model.sku;
        this.unit = model.unit ? {
            id: model.unit._id.toString(),
            name: model.unit.name,
        } : null;
        this.description = model.description;
        this.categories = model.categories.map(({ _id, shortDescription, longDescription, images, name }) => ({
            id: _id.toString(),
            name,
            shortDescription,
            longDescription,
            images,
        }));
    }
}
