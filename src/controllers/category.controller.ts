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
                req.query.name,
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
        req: TypedRequestBody<{ items: string[]; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            await categoryService.deleteCategory(req.body.items);
            res.json();
        } catch (error) {
            next(error);
        }
    }

    public async getCsv(
        req: TypedRequestBody<{ items: string[]; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const fileName = await categoryService.getCsv(req.body.items);
            res.setHeader("Content-Type", "text/csv");
            res.download(fileName, (err) => {
                console.log(err);
                if (err) {
                    res.sendStatus(500);
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export const categoryController = new CategoryController();
