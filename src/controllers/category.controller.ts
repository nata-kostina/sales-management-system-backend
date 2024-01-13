import { NextFunction, Response, Request } from "express";
import { categoryService } from "../services/category.service";
import { ICategoryPayload, TypedRequestBody, TypedRequestParams } from "../types";
import { ICategoryDto } from "../dtos/category/category.dto.interface";
import { CategoryDbDto } from "../dtos/category/category_db.dto";

class CategoryController {
    public async getCategories(
        req: TypedRequestParams<ICategoryDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            let page = Number(req.query.page);
            if (!page) {
                page = 0;
            }
            const categoriesPerPage = Number(req.query.perPage) || 10;

            const { categories, total } = await categoryService.getCategories(
                page * categoriesPerPage,
                categoriesPerPage,
                req.query.sort,
                req.query.order,
            );

            res.json({
                categories,
                page,
                total,
            });
        } catch (error) {
            next(error);
        }
    }

    public async getCategoryList(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const categoryData = await categoryService.getCategoryList();
            res.json({ categories: categoryData });
        } catch (error) {
            next(error);
        }
    }

    public async getCategory(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.params.id;
            const categoryData = await categoryService.getCategory(id);
            res.json({ category: categoryData });
        } catch (error) {
            next(error);
        }
    }

    public async editCategory(
        req: TypedRequestBody<ICategoryPayload>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.params.id;
            const categoryDb = new CategoryDbDto(req);
            const updatedCategory = await categoryService.updateCategory(categoryDb, id);
            res.json({ category: updatedCategory });
        } catch (error) {
            next(error);
        }
    }

    public async addCategory(
        req: TypedRequestBody<ICategoryPayload>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const productDb = new CategoryDbDto(req);
            const newCategory = await categoryService.addCategory(productDb);
            res.json({ category: newCategory });
        } catch (error) {
            next(error);
        }
    }

    public async deleteCategory(
        req: TypedRequestBody<{ categories: string[]; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            await categoryService.deleteCategory(req.body.categories);
            res.json();
        } catch (error) {
            next(error);
        }
    }
}

export const categoryController = new CategoryController();
