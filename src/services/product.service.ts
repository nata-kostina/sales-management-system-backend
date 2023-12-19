import { Types } from "mongoose";
import { ProductDto } from "../dtos/product/product.dto";
import { Product } from "../models/product/product.model";
import { ICategory } from "../models/category/category.interface";
import { Category } from "../models/category/category.model";
import { Brand } from "../models/brand/brand.model";
import { Unit } from "../models/unit/unit.model";
import { CategoryDto } from "../dtos/category/category.dto";
import { UnitDto } from "../dtos/unit/unit.dto";
import { BrandDto } from "../dtos/brand/brand.dto";
import { IProduct } from "../models/product/product.interface";

class ProductService {
    public async getProducts(
        skip: number,
        limit: number,
    ): Promise<ProductDto[]> {
        const products = await Product.find().skip(skip).limit(limit)
            .populate<{
                brand: {
                    _id: Types.ObjectId;
                    name: string;
                };
            }>("brand", "_id name")
            .populate<{
                unit: {
                    _id: Types.ObjectId;
                    name: string;
                };
            }>("unit", "_id name")
            .populate<{
                categories: Array<ICategory & { _id: Types.ObjectId; }>;
            }>("categories");

        const productDtos: ProductDto[] = products.map(
            (product) => new ProductDto(product),
        );
        return [...productDtos];
    }

    public async getProduct(id?: string): Promise<ProductDto> {
        const product = await Product.findOne({ _id: id }).populate<{
            brand: {
                _id: Types.ObjectId;
                name: string;
            };
        }>("brand", "_id name")
            .populate<{
                unit: {
                    _id: Types.ObjectId;
                    name: string;
                };
            }>("unit", "_id name")
            .populate<{
                categories: Array<ICategory & { _id: Types.ObjectId; }>;
            }>("categories");
        const productDto: ProductDto = new ProductDto(product);
        return productDto;
    }

    public async updateProduct(
        payload: IProduct & { id: string; },
        id: string,
    ): Promise<ProductDto> {
        const product = await Product.findOne({ _id: id });
        await product.updateOne({ ...payload });

        const updatedProduct = await Product.findOne({ _id: id })
            .populate<{
                brand: {
                    _id: Types.ObjectId;
                    name: string;
                };
            }>("brand", "_id name")
            .populate<{
                unit: {
                    _id: Types.ObjectId;
                    name: string;
                };
            }>("unit", "_id name")
            .populate<{
                categories: Array<ICategory & { _id: Types.ObjectId; }>;
            }>("categories");

        const productDto: ProductDto = new ProductDto(updatedProduct);
        return productDto;
    }

    public async addProduct(payload: IProduct): Promise<ProductDto> {
        const newProduct = await Product.create(payload);
        const product = await Product.findOne({ _id: newProduct._id })
            .populate<{
                brand: {
                    _id: Types.ObjectId;
                    name: string;
                };
            }>("brand", "_id name")
            .populate<{
                unit: {
                    _id: Types.ObjectId;
                    name: string;
                };
            }>("unit", "_id name")
            .populate<{
                categories: Array<ICategory & { _id: Types.ObjectId; }>;
            }>("categories");

        console.log({ ...product });
        const productDto: ProductDto = new ProductDto(product);
        return productDto;
    }

    public async deleteProduct(id: string): Promise<void> {
        console.log({ id });
        await Product.deleteOne({ _id: id });
    }

    public async getFormOptions(): Promise<{
        categories: CategoryDto[];
        units: UnitDto[];
        brands: BrandDto[];
    }> {
        const categories = await Category.find();
        const units = await Unit.find();
        const brands = await Brand.find();

        const categoryDtos: CategoryDto[] = categories.map((category) => new CategoryDto(category));
        const unitDtos: UnitDto[] = units.map((unit) => new UnitDto(unit));
        const brandDtos: BrandDto[] = brands.map((brand) => new BrandDto(brand));
        return {
            categories: categoryDtos,
            units: unitDtos,
            brands: brandDtos,
        };
    }
}

export const productService = new ProductService();
