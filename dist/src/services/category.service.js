import fs from "fs";
import * as csv from "fast-csv";
import path from "path";
import { generatedFilesPath, uploadsPath } from "../../constants";
import { CategoryDto } from "../dtos/category/category.dto";
import { Category } from "../models/category/category.model";
import { createDateForFile } from "../utils";
class CategoryService {
    async getCategories(skip, limit, sort, order, name) {
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        filter.deleted = false;
        const categories = await Category.find().find(filter).sort({ [sort]: order === "ascend" ? 1 : -1 });
        const total = categories.length;
        const slicedCategories = categories.slice(skip, skip + limit);
        const categoriesDtos = slicedCategories.map((category) => new CategoryDto(category));
        return {
            categories: categoriesDtos,
            total,
        };
    }
    async getCategoryList() {
        const categories = await Category.find({}, "name");
        const categoryDtos = categories.map((category) => ({ id: category._id.toString(), name: category.name }));
        return [...categoryDtos];
    }
    async getCategory(id) {
        const category = await Category.findOne({ _id: id, deleted: false });
        const categoryDto = new CategoryDto(category);
        return categoryDto;
    }
    async updateCategory(payload, id) {
        try {
            const category = await Category.findOne({ _id: id, deleted: false });
            await category.updateOne({ ...payload });
            for (const image of category.images) {
                try {
                    await fs.promises.unlink(`${uploadsPath}/${image.filename}`);
                }
                catch (error) {
                }
            }
            const updatedCategory = await Category.findOne({ _id: id });
            const categoryDto = new CategoryDto(updatedCategory);
            return categoryDto;
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
    async addCategory(payload) {
        const newCategory = await Category.create(payload);
        const category = await Category.findOne({ _id: newCategory._id, deleted: false });
        const categoryDto = new CategoryDto(category);
        return categoryDto;
    }
    async deleteCategory(categories) {
        let categoriesToDelete;
        if (categories && categories.length > 0) {
            categoriesToDelete = await Category.find({ _id: { $in: categories }, deleted: false });
        }
        else {
            categoriesToDelete = await Category.find({ deleted: false });
        }
        for (const category of categoriesToDelete) {
            await Category.updateOne({ _id: category._id }, { $set: { deleted: true } });
        }
    }
    async getCsv(categories) {
        const dbData = await Category.find(categories.length === 0 ? { deleted: false } : { _id: { $in: categories }, deleted: false });
        return new Promise((resolve, reject) => {
            const fileName = path.join(generatedFilesPath, `categories_data_${createDateForFile()}.csv`);
            const csvFile = fs.createWriteStream(fileName);
            const data = [];
            for (const category of dbData) {
                const images = category.images.map((i) => i.path)
                    .reduce((acc, curr, idx) => {
                    acc[`category_image_${idx + 1}`] = curr;
                    return acc;
                }, {});
                const info = {
                    name: category.name,
                    short_description: category.shortDescription ?? "",
                    long_description: category.longDescription ?? "",
                };
                data.push({ ...info, ...images });
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
    validate() {
    }
}
export const categoryService = new CategoryService();
//# sourceMappingURL=category.service.js.map