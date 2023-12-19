import { CategoryDto } from "../dtos/category/category.dto";
import { Category } from "../models/category/category.model";

class CategoryService {
    public async getCategories(
        skip: number,
        limit: number
    ): Promise<CategoryDto[]> {
        const categories = await Category.find().skip(skip).limit(limit);
        const categoryDtos: CategoryDto[] = categories.map(
            (product) => new CategoryDto(product)
        );
        return [...categoryDtos];
    }
}

export const categoryService = new CategoryService();
