import fs from "fs";
import * as csv from "fast-csv";
import path from "path";
import { FilterQuery } from "mongoose";
import { generatedFilesPath, uploadsPath } from "../../constants";
import { CategoryDto } from "../dtos/category/category.dto";
import { ICategoryDb } from "../dtos/category/category_db.interface";
import { Category } from "../models/category/category.model";
import { ICategory, ICategoryCsvItem } from "../models/category/category.interface";
import { createDateForFile } from "../utils";

class CategoryService {
    public async getCategories(
        skip: number,
        limit: number,
        sort?: keyof CategoryDto,
        order?: "ascend" | "descend",
        name?: string,
    ): Promise<{ categories: CategoryDto[]; total: number; }> {
        const filter: FilterQuery<ICategory> = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        filter.deleted = false;
        const categories = await Category.find().find(filter).sort({ [sort]: order === "ascend" ? 1 : -1 });
        const total = categories.length;
        const slicedCategories = categories.slice(skip, skip + limit);

        const categoriesDtos: CategoryDto[] = slicedCategories.map(
            (category) => new CategoryDto(category),
        );
        return {
            categories: categoriesDtos,
            total,
        };
    }

    public async getCategoryList(): Promise<CategoryDto[]> {
        const categories = await Category.find({}, "name");
        const categoryDtos: CategoryDto[] = categories.map(
            (category) => new CategoryDto(category),
        );
        return [...categoryDtos];
    }

    public async getCategory(id?: string): Promise<CategoryDto> {
        const category = await Category.findOne({ _id: id, deleted: false });
        const categoryDto: CategoryDto = new CategoryDto(category);
        return categoryDto;
    }

    public async updateCategory(
        payload: ICategoryDb,
        id: string,
    ): Promise<CategoryDto> {
        try {
            const category = await Category.findOne({ _id: id, deleted: false });
            await category.updateOne({ ...payload });

            for (const image of category.images) {
                try {
                    await fs.promises.unlink(`${uploadsPath}/${image.filename}`);
                } catch (error) {
                }
            }
            const updatedCategory = await Category.findOne({ _id: id });

            const categoryDto: CategoryDto = new CategoryDto(updatedCategory);
            return categoryDto;
        } catch (error) {
            for (const image of payload.images) {
                try {
                    await fs.promises.unlink(`${uploadsPath}/${image.filename}`);
                } catch (error) {
                }
            }
            throw error;
        }
    }

    public async addCategory(payload: ICategoryDb): Promise<CategoryDto> {
        const newCategory = await Category.create(payload);
        const category = await Category.findOne({ _id: newCategory._id, deleted: false });

        const categoryDto: CategoryDto = new CategoryDto(category);
        return categoryDto;
    }

    public async deleteCategory(categories?: string[]): Promise<void> {
        let categoriesToDelete;
        if (categories && categories.length > 0) {
            categoriesToDelete = await Category.find({ _id: { $in: categories }, deleted: false });
        } else {
            categoriesToDelete = await Category.find({ deleted: false });
        }
        for (const category of categoriesToDelete) {
            await Category.updateOne({ _id: category._id }, { $set: { deleted: true } });
        }
    }

    public async getCsv(categories: string[]): Promise<string> {
        const dbData = await Category.find(categories.length === 0 ? { deleted: false } : { _id: { $in: categories }, deleted: false });
        return new Promise<string>((resolve, reject) => {
            const fileName = path.join(generatedFilesPath, `categories_data_${createDateForFile()}.csv`);
            const csvFile = fs.createWriteStream(fileName);

            const data: ICategoryCsvItem[] = [];
            for (const category of dbData) {
                const images = category.images.map((i) => i.path)
                    .reduce((acc, curr, idx) => {
                        acc[`category_image_${idx + 1}`] = curr;
                        return acc;
                    }, {} as Record<string, string>);
                const info: ICategoryCsvItem = {
                    name: category.name,
                    short_description: category.shortDescription ?? "",
                    long_description: category.longDescription ?? "",
                };
                data.push({ ...info, ...images });
            }

            const headers = new Set<string>();
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

export const categoryService = new CategoryService();
