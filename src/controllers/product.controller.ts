import { NextFunction, Response, Request } from "express";
import { productService } from "../services/product.service";
import { IProductPayload, TypedRequestBody, TypedRequestParams } from "../types";
import { IProductDto } from "../dtos/product/product.dto.interface";
import { ProductDbDto } from "../dtos/product/product_db.dto";
import { IProduct } from "../models/product/product.interface";

class ProductController {
    public async getProducts(
        req: TypedRequestParams<IProductDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            let page = Number(req.query.page);
            if (!page) {
                page = 0;
            }
            const productsPerPage = Number(req.query.perPage) || 10;

            const { products, total } = await productService.getProducts(
                page * productsPerPage,
                productsPerPage,
                req.query.sort,
                req.query.order,
                req.query.name,
                req.query.categories,
                req.query.sku,
            );

            res.json({
                products,
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
        req: TypedRequestBody<IProductPayload>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.params.id;
            const productDb = new ProductDbDto(req);
            const updatedProduct = await productService.updateProduct(productDb, id);
            res.json({ product: updatedProduct });
        } catch (error) {
            next(error);
        }
    }

    public async addProduct(
        req: TypedRequestBody<IProductPayload>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const productDb = new ProductDbDto(req);
            const newProduct = await productService.addProduct(productDb);
            res.json({ product: newProduct });
        } catch (error) {
            next(error);
        }
    }

    public async deleteProduct(
        req: TypedRequestBody<{ products: string[]; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            await productService.deleteProduct(req.body.products);
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
            res.json({ brands, categories, units });
        } catch (error) {
            next(error);
        }
    }

    public async getProductsList(
        req: TypedRequestParams<IProduct>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const products = await productService.getProductsList(req.query.name);
            res.json(products);
        } catch (error) {
            next(error);
        }
    }
}

export const productController = new ProductController();
