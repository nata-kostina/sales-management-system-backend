import { NextFunction, Response, Request } from "express";
import { productService } from "../services/product.service";
import { Category } from "../models/category/category.model";
import { categoryService } from "../services/category.service";

class CategoryController {
    public async getCategories(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            let page = Number(req.query.p);
            if (page) {
                page--;
            } else {
                page = 0;
            }
            const categoriesPerPage = Number(req.query.perPage) || 10;
            const categoryData = await productService.getProducts(
                page * categoriesPerPage,
                categoriesPerPage,
            );
            const total = await Category.count();
            res.json({
                products: categoryData,
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
}

export const categoryController = new CategoryController();
