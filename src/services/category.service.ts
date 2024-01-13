import { promises as fs } from "fs";
import { uploadsPath } from "../../constants";
import { CategoryDto } from "../dtos/category/category.dto";
import { ICategoryDb } from "../dtos/category/category_db.interface";
import { Category } from "../models/category/category.model";

class CategoryService {
    public async getCategories(
        skip: number,
        limit: number,
        sort?: keyof CategoryDto,
        order?: "ascend" | "descend",
    ): Promise<{ categories: CategoryDto[]; total: number; }> {
        const categories = await Category.find().sort({ [sort]: order === "ascend" ? 1 : -1 });
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
        const category = await Category.findOne({ _id: id });
        const categoryDto: CategoryDto = new CategoryDto(category);
        return categoryDto;
    }

    public async updateCategory(
        payload: ICategoryDb,
        id: string,
    ): Promise<CategoryDto> {
        const category = await Category.findOne({ _id: id });
        category.images.forEach((i) => fs.unlink(`${uploadsPath}/${i.filename}`));

        await category.updateOne({ ...payload });

        const updatedCategory = await Category.findOne({ _id: id });

        const categoryDto: CategoryDto = new CategoryDto(updatedCategory);
        return categoryDto;
    }

    public async addCategory(payload: ICategoryDb): Promise<CategoryDto> {
        const newCategory = await Category.create(payload);
        const category = await Category.findOne({ _id: newCategory._id });

        const categoryDto: CategoryDto = new CategoryDto(category);
        return categoryDto;
    }

    public async deleteCategory(categories: string[]): Promise<void> {
        const categoriesToDelete = await Category.findOne({ _id: { $in: categories } });
        await Promise.all(categoriesToDelete.images.map((i) => fs.unlink(`${uploadsPath}/${i.filename}`)));
        await Category.deleteMany({ _id: { $in: categories } });
    }
}

export const categoryService = new CategoryService();
