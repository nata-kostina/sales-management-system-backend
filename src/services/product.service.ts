/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
import { FilterQuery, Types } from "mongoose";
import { promises as fs } from "fs";
import path from "path";
import { __dirname } from "../../constants";
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
import { IProductDb } from "../dtos/product/product_db.interface";

class ProductService {
    public async getProducts(
        skip: number,
        limit: number,
        sort?: keyof ProductDto,
        order?: "ascend" | "descend",
        name?: string,
        categories?: string,
        sku?: string,
        brand?: string,
    ): Promise<{ products: ProductDto[]; total: number; }> {
        const filter: FilterQuery<IProduct> = {};
        if (name) {
            filter.name = { $regex: name };
        }
        if (categories) {
            filter.categories = { $all: categories.split(",").map((c) => new Types.ObjectId(c)) };
        }
        if (sku) {
            filter.sku = { $regex: sku };
        }
        if (brand) {
            filter.brand = { $all: brand.split(",").map((c) => new Types.ObjectId(c)) };
        }
        const products = await Product
            .find(filter)
            .sort({ [sort]: order === "ascend" ? 1 : -1 });
        const total = products.length;
        const skippedProducts = products.slice(skip, skip + limit);
        // eslint-disable-next-line no-spaced-func
        const populatedDocuments = await Product.populate<
            {
                brand: {
                    _id: Types.ObjectId;
                    name: string;
                };
                unit: {
                    _id: Types.ObjectId;
                    name: string;
                };
                categories: (ICategory & { _id: Types.ObjectId; })[];
            }
                    >(skippedProducts, [
                        { path: "brand", model: "Brand", select: "_id name" },
                        { path: "unit", model: "Unit", select: "_id name" },
                        { path: "categories", model: "Category" },
                    ]);

        const productDtos: ProductDto[] = populatedDocuments.map(
            (product) => new ProductDto(product),
        );
        return {
            products: productDtos,
            total,
        };
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
        payload: IProductDb,
        id: string,
    ): Promise<ProductDto> {
        const product = await Product.findOne({ _id: id });
        const uploadsPath = path.join(__dirname, "uploads");
        product.images.forEach((i) => fs.unlink(`${uploadsPath}/${i.filename}`));

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

    public async addProduct(payload: IProductDb): Promise<ProductDto> {
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

        const productDto: ProductDto = new ProductDto(product);
        return productDto;
    }

    public async deleteProduct(products: string[]): Promise<void> {
        await Product.deleteMany({ _id: { $in: products } });
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
