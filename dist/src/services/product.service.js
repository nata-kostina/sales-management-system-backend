/* eslint-disable @typescript-eslint/ban-types */
import { Types } from "mongoose";
import fs from "fs";
import * as csv from "fast-csv";
import path from "path";
import { ProductDto } from "../dtos/product/product.dto";
import { Product } from "../models/product/product.model";
import { Category } from "../models/category/category.model";
import { Brand } from "../models/brand/brand.model";
import { Unit } from "../models/unit/unit.model";
import { CategoryDto } from "../dtos/category/category.dto";
import { UnitDto } from "../dtos/unit/unit.dto";
import { BrandDto } from "../dtos/brand/brand.dto";
import { generatedFilesPath, uploadsPath } from "../../constants";
import { ProductListDto } from "../dtos/product/product_list.dto";
import { createDateForFile, sortByPriority } from "../utils";
class ProductService {
    async getProducts(skip, limit, sort, order, name, categories, sku, brand, unit) {
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
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
        if (unit) {
            filter.unit = { $all: unit.split(",").map((c) => new Types.ObjectId(c)) };
        }
        filter.deleted = false;
        const products = await Product
            .find(filter)
            .sort({ [sort]: order === "ascend" ? 1 : -1 });
        const total = products.length;
        const slicedProducts = products.slice(skip, skip + limit);
        // eslint-disable-next-line no-spaced-func
        const populatedDocuments = await Product.populate(slicedProducts, [
            { path: "brand", model: "Brand", select: "_id name" },
            { path: "unit", model: "Unit", select: "_id name" },
            { path: "categories", model: "Category" },
        ]);
        const productDtos = populatedDocuments.map((product) => new ProductDto(product));
        return {
            products: productDtos,
            total,
        };
    }
    async getProduct(id) {
        const product = await Product.findOne({ _id: id, deleted: false }).populate("brand", "_id name")
            .populate("unit", "_id name")
            .populate("categories");
        const productDto = new ProductDto(product);
        return productDto;
    }
    async updateProduct(payload, id) {
        try {
            const product = await Product.findOne({ _id: id, deleted: false });
            await product.updateOne({ ...payload });
            for (const image of product.images) {
                try {
                    await fs.promises.unlink(`${uploadsPath}/${image.filename}`);
                }
                catch (error) {
                }
            }
            const updatedProduct = await Product.findOne({ _id: id, deleted: false })
                .populate("brand", "_id name")
                .populate("unit", "_id name")
                .populate("categories");
            const productDto = new ProductDto(updatedProduct);
            return productDto;
        }
        catch (error) {
            for (const image of payload.images) {
                try {
                    await fs.promises.unlink(`${uploadsPath}/${image.filename}`);
                }
                catch (error) {
                }
            }
            throw error;
        }
    }
    async addProduct(payload) {
        const newProduct = await Product.create(payload);
        const product = await Product.findOne({ _id: newProduct._id, deleted: false })
            .populate("brand", "_id name")
            .populate("unit", "_id name")
            .populate("categories");
        const productDto = new ProductDto(product);
        return productDto;
    }
    async deleteProducts(products) {
        let productsToDelete;
        if (products && products.length > 0) {
            productsToDelete = await Product.find({ _id: { $in: products }, deleted: false });
        }
        else {
            productsToDelete = await Product.find({ deleted: false });
        }
        for (const product of productsToDelete) {
            await Product.updateOne({ _id: product._id }, { $set: { deleted: true } });
        }
    }
    async getFormOptions() {
        const categories = await Category.find();
        const units = await Unit.find();
        const brands = await Brand.find();
        const categoryDtos = categories.map((category) => new CategoryDto(category));
        const unitDtos = units.sort(sortByPriority).map((unit) => new UnitDto(unit));
        const brandDtos = brands.map((brand) => new BrandDto(brand));
        return {
            categories: categoryDtos,
            units: unitDtos,
            brands: brandDtos,
        };
    }
    async getProductsList(name) {
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        filter.deleted = false;
        const products = await Product.find(filter);
        const productDtos = products.map((product) => new ProductListDto(product));
        return { products: productDtos };
    }
    async getCsv(products) {
        const dbData = await Product.find(products.length === 0 ? { deleted: false } : { _id: { $in: products }, deleted: false })
            .populate("brand", "name")
            .populate("unit", "name")
            .populate("categories", "name");
        return new Promise((resolve, reject) => {
            const fileName = path.join(generatedFilesPath, `products_data_${createDateForFile()}.csv`);
            const csvFile = fs.createWriteStream(fileName);
            const data = [];
            for (const product of dbData) {
                const images = product.images.map((i) => i.path)
                    .reduce((acc, curr, idx) => {
                    acc[`product_image_${idx + 1}`] = curr;
                    return acc;
                }, {});
                const categories = product.categories.map((c) => c.name)
                    .reduce((acc, curr, idx) => {
                    acc[`category_${idx + 1}`] = curr;
                    return acc;
                }, {});
                const info = {
                    name: product.name,
                    sku: product.sku ?? "",
                    description: product.description ?? "",
                    brand: product.brand.name,
                    unit: product.unit.name,
                    price: product.price,
                    quantity: product.quantity,
                };
                data.push({ ...info, ...categories, ...images });
            }
            const headers = new Set();
            data.forEach((item) => {
                Object.keys(item).forEach((key) => {
                    headers.add(key);
                });
            });
            const headersArray = Array.from(headers);
            csvFile.write("sep=,\n");
            const csvStream = csv.format({ headers: headersArray });
            csvStream.pipe(csvFile);
            csvStream.on("end", () => {
                csvFile.end(() => resolve(fileName));
            });
            csvStream.on("error", () => reject());
            data.forEach(row => csvStream.write(row));
            csvStream.end();
        });
    }
}
export const productService = new ProductService();
//# sourceMappingURL=product.service.js.map