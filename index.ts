/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-floating-promises */
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { __dirname } from "./constants";
import { authRouter } from "./src/routers/auth.router.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import { productRouter } from "./src/routers/product.router.js";
import { categoryRouter } from "./src/routers/category.router.js";
import { customerRouter } from "./src/routers/customer.router.js";
import { saleRouter } from "./src/routers/sale.router.js";
import { Customer } from "./src/models/customer/customer.model.js";
import { Category } from "./src/models/category/category.model.js";
import { Sale } from "./src/models/sale/sale.model.js";
import { Product } from "./src/models/product/product.model.js";
import { Brand } from "./src/models/brand/brand.model.js";
import { brandRouter } from "./src/routers/brands.router.js";
import { unitRouter } from "./src/routers/unit.router.js";
import { Unit } from "./src/models/unit/unit.model.js";
import { SaleStatus } from "./src/models/sale-status/sales-status.model";
import { Payment } from "./src/models/payment/payment.model";
import { EPayment } from "./src/models/payment/payment.interface";
import { saleStatusesRouter } from "./src/routers/saleStatuses.router";
import { paymentRouter } from "./src/routers/payment.router";

/* SERVER CONFIGURATION */
const app = express();

app.use(morgan("common"));
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

app.use(express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 9000;

/* ROUTES */
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/customers", customerRouter);
app.use("/api/sales", saleRouter);
app.use("/api/products", productRouter);
app.use("/api/brands", brandRouter);
app.use("/api/units", unitRouter);
app.use("/api/statuses", saleStatusesRouter);
app.use("/api/payment", paymentRouter);

/* ERROR HANDLER MIDDLEWARE */
app.use(errorMiddleware);

/* MONGOOSE CONFIGURATION */
mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        app.listen(PORT, () =>
            console.log(`Server is listening on port ${PORT}`),
        );

        // Payment.create({
        //     name: EPayment.Paid,
        //     priority: 1,
        // });
        // Payment.create({
        //     name: EPayment.Unpaid,
        //     priority: 2,
        // });
        // Payment.create({
        //     name: EPayment.Overdue,
        //     priority: 3,
        // });
        // Payment.create({
        //     name: EPayment.Declined,
        //     priority: 4,
        // });
        // Payment.create({
        //     name: EPayment.Refunded,
        //     priority: 5,
        // });
        // Payment.create({
        //     name: EPayment.Cancelled,
        //     priority: 6,
        // });
        // SaleStatus.create({
        //     name: "Shipped",
        //     priority: 3,
        // });
        // SaleStatus.create({
        //     name: "Delivered",
        //     priority: 4,
        // });
        // SaleStatus.create({
        //     name: "Cancelled",
        //     priority: 5,
        // });
        // SaleStatus.create({
        //     name: "Returned",
        //     priority: 6,
        // });
        // SaleStatus.create({
        //     name: "In Transit",
        //     priority: 2,
        // });
        // SaleStatus.create({
        //     name: "Awaiting Payment",
        //     priority: 1,
        // });
        // // Pending = "Pending",
        // // Shipped = "Shipped",
        // // Delivered = "Delivered",
        // // Cancelled = "Cancelled",
        // // Returned = "Returned",
        // // InTransit = "In Transit",
        // // AwaitingPayment = "Awaiting Payment",
        // Category.create({
        //     name: "Baseball bat",
        //     image: {
        //         src: "data:image/jpeg;base64,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",
        //         name: "image-1.jpg",
        //     },
        //     description: "Baseball bat category description",
        // });
        // Category.create({
        //     name: "Baseball",
        //     image: {
        //         src: "data:image/jpeg;base64,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",
        //         name: "image-1.jpg",
        //     },
        //     description: "Baseball category description",
        // });
        // Product.create({
        //     name: "Baseball bat",
        //     price: 44.99,
        //     brand: "655d3a0a2d6df5f0b99c6810",
        //     quantity: 5,
        //     sku: "43546783",
        //     unit: "655d4a1a85c3599fb428b93e",
        //     description: "Test description",
        //     categories: ["655fa967e4410a1bff328d12", "655fa967e4410a1bff328d14"],
        //     images: [
        //         {
        //             src: "https://macdougallbats.com/cdn/shop/products/K-3_Clear-Red_5000x.jpg?v=1611183020",
        //             name: "image-1.jpg",
        //         },
        //         {
        //             src: "https://m.media-amazon.com/images/I/61UuJ+YPURL._AC_UF350,350_QL50_.jpg",
        //             name: "image-2.jpg",
        //         },
        //         {
        //             src: "data:image/jpeg;base64,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",
        //             name: "image-3.jpg",
        //         },
        //     ],
        // });
        // Product.create({
        //     name: "Baseball glove",
        //     price: 10.99,
        //     brand: "655d3a0a2d6df5f0b99c680f",
        //     quantity: 65,
        //     sku: "43516783",
        //     unit: "655d4a1a85c3599fb428b93e",
        //     description: "Test description",
        //     categories: ["655fa967e4410a1bff328d12"],
        //     images: [{
        //         src: "https://apim.canadiantire.ca/v1/product/api/v1/product/image/0801155p?baseStoreId=CTR&lang=en_CA&subscription-key=c01ef3612328420c9f5cd9277e815a0e&imwidth=640",
        //         name: "image-2.jpg",
        //     }],
        // });
        // Product.create({
        //     name: "Baseball ball",
        //     price: 14.99,
        //     brand: "655d3a0a2d6df5f0b99c6811",
        //     quantity: 22,
        //     sku: "43826783",
        //     unit: "655d4a1a85c3599fb428b93e",
        //     description: "Test description",
        //     categories: ["655fa967e4410a1bff328d12"],
        //     images: [{
        //         src: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Baseball_%28crop%29.jpg/1200px-Baseball_%28crop%29.jpg",
        //         name: "image-3.jpg",
        //     }],
        // });
        // Customer.create({
        //     name: "John Smith",
        //     country: "Poland",
        //     email: "customer.test@gmail.com",
        //     phone: "+465263782",
        // });

        // Category.create({
        //     name: "Baseball",
        //     description: "Welcome to our comprehensive selection of top-quality baseball gear and equipment. Whether you're a seasoned pro or just starting out on the diamond, we have everything you need to elevate your game. Explore our extensive range of products designed to enhance your performance, safety, and style on the field. From bats to gloves, apparel to accessories, we've got you covered.",
        //     image: ["https://papreplive.com/wp-content/uploads/2021/04/Baseballstock-scaled.jpg"],
        // });

        // const customer = await Customer.findById("65361c7198fe8c4f51b78f9e").exec();
        // Sales.create({
        //     date: "2023-10-23T07:10:41.763+00:00",
        //     paid: "100",
        //     total: "100",
        //     status: "Paid",
        //     customer: {
        //         id: customer._id,
        //         name: customer.name,
        //     },
        // });
        // const sales = Sales.findById("65361c7198fe8c4f51b78f9e").then((result) => console.log(result));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })
    .catch((error) => console.log(error));
