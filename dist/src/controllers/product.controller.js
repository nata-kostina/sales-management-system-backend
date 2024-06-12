import { productService } from "../services/product.service";
import { ProductDbDto } from "../dtos/product/product_db.dto";
class ProductController {
    async getProducts(req, res, next) {
        try {
            let page = Number(req.query.page);
            if (!page) {
                page = 0;
            }
            const productsPerPage = Number(req.query.perPage) || 10;
            const { products, total } = await productService.getProducts(page * productsPerPage, productsPerPage, req.query.sort, req.query.order, req.query.name, req.query.categories, req.query.sku, req.query.brand, req.query.unit);
            res.json({
                products,
                page,
                total,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getProduct(req, res, next) {
        try {
            const id = req.params.id;
            const productData = await productService.getProduct(id);
            res.json({
                product: productData,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async editProduct(req, res, next) {
        try {
            const id = req.params.id;
            const productDb = new ProductDbDto(req);
            const updatedProduct = await productService.updateProduct(productDb, id);
            res.json({ product: updatedProduct });
        }
        catch (error) {
            next(error);
        }
    }
    async addProduct(req, res, next) {
        try {
            const productDb = new ProductDbDto(req);
            const newProduct = await productService.addProduct(productDb);
            res.json({ product: newProduct });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteProducts(req, res, next) {
        try {
            await productService.deleteProducts(req.body.items);
            res.json();
        }
        catch (error) {
            next(error);
        }
    }
    async getFormOptions(req, res, next) {
        try {
            const { brands, categories, units } = await productService.getFormOptions();
            res.json({ brands, categories, units });
        }
        catch (error) {
            next(error);
        }
    }
    async getProductsList(req, res, next) {
        try {
            const products = await productService.getProductsList(req.query.name);
            res.json(products);
        }
        catch (error) {
            next(error);
        }
    }
    async getCsv(req, res, next) {
        try {
            const fileName = await productService.getCsv(req.body.items);
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
export const productController = new ProductController();
//# sourceMappingURL=product.controller.js.map