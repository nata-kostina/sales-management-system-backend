import { NextFunction, Response, Request } from "express";
import { productService } from "../services/product.service";
import { Product } from "../models/product/product.model";
import { TypedRequestBody } from "../types";
import { IProduct } from "../models/product/product.interface";

class ProductController {
    public async getProducts(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            let page = Number(req.query.page);
            if (!page) {
                page = 0;
            }
            const productsPerPage = Number(req.query.perPage) || 10;
            console.log("page: ", page);
            console.log("productsPerPage: ", productsPerPage);
            const productData = await productService.getProducts(
                page * productsPerPage,
                productsPerPage,
            );
            const total = await Product.count();
            // console.log("total: ", total);
            res.json({
                products: productData,
                page,
                total,
            });
        } catch (error) {
            next(error);
        }
    }

    public async getProduct(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.params.id;
            const productData = await productService.getProduct(id);
            res.json({
                product: productData,
            });
        } catch (error) {
            next(error);
        }
    }

    public async editProduct(
        req: TypedRequestBody<{ product: IProduct & { id: string; }; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.params.id;
            const updatedProduct = await productService.updateProduct(req.body.product, id);
            res.json({
                product: updatedProduct,
            });
        } catch (error) {
            next(error);
        }
    }

    public async addProduct(
        req: TypedRequestBody<{ product: IProduct; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const newProduct = await productService.addProduct(req.body.product);
            res.json({
                product: newProduct,
            });
        } catch (error) {
            next(error);
        }
    }

    public async deleteProduct(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.params.id;
            await productService.deleteProduct(id);
            res.json();
        } catch (error) {
            next(error);
        }
    }

    public async getFormOptions(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { brands, categories, units } = await productService.getFormOptions();
            res.json({
                brands, categories, units,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const productController = new ProductController();
