import { categoryService } from "../services/category.service";
import { CategoryDbDto } from "../dtos/category/category_db.dto";
class CategoryController {
    async getCategories(req, res, next) {
        try {
            let page = Number(req.query.page);
            if (!page) {
                page = 0;
            }
            const categoriesPerPage = Number(req.query.perPage) || 10;
            const { categories, total } = await categoryService.getCategories(page * categoriesPerPage, categoriesPerPage, req.query.sort, req.query.order, req.query.name);
            res.json({
                categories,
                page,
                total,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCategoryList(req, res, next) {
        try {
            const categoryData = await categoryService.getCategoryList();
            res.json({ categories: categoryData });
        }
        catch (error) {
            next(error);
        }
    }
    async getCategory(req, res, next) {
        try {
            const id = req.params.id;
            const categoryData = await categoryService.getCategory(id);
            res.json({ category: categoryData });
        }
        catch (error) {
            next(error);
        }
    }
    async editCategory(req, res, next) {
        try {
            const id = req.params.id;
            const categoryDb = new CategoryDbDto(req);
            const updatedCategory = await categoryService.updateCategory(categoryDb, id);
            res.json({ category: updatedCategory });
        }
        catch (error) {
            next(error);
        }
    }
    async addCategory(req, res, next) {
        try {
            const productDb = new CategoryDbDto(req);
            const newCategory = await categoryService.addCategory(productDb);
            res.json({ category: newCategory });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteCategory(req, res, next) {
        try {
            await categoryService.deleteCategory(req.body.items);
            res.json();
        }
        catch (error) {
            next(error);
        }
    }
    async getCsv(req, res, next) {
        try {
            const fileName = await categoryService.getCsv(req.body.items);
            res.setHeader("Content-Type", "text/csv");
            res.download(fileName, (err) => {
                if (err) {
                    res.sendStatus(500);
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export const categoryController = new CategoryController();
//# sourceMappingURL=category.controller.js.map