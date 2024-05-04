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
import { brandRouter } from "./src/routers/brands.router.js";
import { unitRouter } from "./src/routers/unit.router.js";
import { saleStatusesRouter } from "./src/routers/saleStatuses.router";
import { paymentRouter } from "./src/routers/payment.router";
import { statisticsRouter } from "./src/routers/statistics.router";
import { Sale } from "./src/models/sale/sale.model";
import { ISale } from "./src/models/sale/sale.interface";

/* SERVER CONFIGURATION */
const app = express();

app.use(morgan("common"));
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
app.use("/api/statistics", statisticsRouter);

/* ERROR HANDLER MIDDLEWARE */
app.use(errorMiddleware);

/* MONGOOSE CONFIGURATION */
mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        app.listen(PORT, () =>
            console.log(`Server is listening on port ${PORT}`),
        );
        // const sales: ISale[] = [
        //     {
        //         reference: "0001",
        //         customer: new mongoose.Types.ObjectId("660c5bff5fda83d41418f7c6"),
        //         date: new Date(1726889200000), // Date for March 21, 2024
        //         payment: new mongoose.Types.ObjectId("65d84cf0ed0d25528acfc5cd"),
        //         status: new mongoose.Types.ObjectId("65d84ac6c2e3450df42ff106"),
        //         products: [
        //             {
        //                 product: new mongoose.Types.ObjectId("660d432c9354fc8ecda24895"),
        //                 price: 50,
        //                 quantity: 1,
        //                 total: 50,
        //             },
        //             {
        //                 product: new mongoose.Types.ObjectId("660d432c9354fc8ecda24896"),
        //                 price: 40,
        //                 quantity: 2,
        //                 total: 80,
        //             }
        //         ],
        //         total: 130,
        //         paid: 100, // Paid $100
        //     },
        //     {
        //         reference: "0002",
        //         customer: new mongoose.Types.ObjectId("660c5bff5fda83d41418f7ca"),
        //         date: new Date(1726871600000), // Date for March 20, 2024
        //         payment: new mongoose.Types.ObjectId("65d84cf0ed0d25528acfc5cc"),
        //         status: new mongoose.Types.ObjectId("65d84ac6c2e3450df42ff105"),
        //         products: [
        //             {
        //                 product: new mongoose.Types.ObjectId("660d432c9354fc8ecda24897"),
        //                 price: 25,
        //                 quantity: 3,
        //                 total: 75,
        //             },
        //             {
        //                 product: new mongoose.Types.ObjectId("660d432c9354fc8ecda24898"),
        //                 price: 35,
        //                 quantity: 2,
        //                 total: 70,
        //             }
        //         ],
        //         total: 145,
        //         paid: 145, // Fully paid
        //     },
        //     {
        //         reference: "0003",
        //         customer: new mongoose.Types.ObjectId("660c5bff5fda83d41418f7ce"),
        //         date: new Date(1726854000000), // Date for March 19, 2024
        //         payment: new mongoose.Types.ObjectId("65d84cf0ed0d25528acfc5d0"),
        //         status: new mongoose.Types.ObjectId("65d84ac6c2e3450df42ff107"),
        //         products: [
        //             {
        //                 product: new mongoose.Types.ObjectId("660d432c9354fc8ecda24899"),
        //                 price: 45,
        //                 quantity: 1,
        //                 total: 45,
        //             },
        //             {
        //                 product: new mongoose.Types.ObjectId("660d432c9354fc8ecda2489a"),
        //                 price: 30,
        //                 quantity: 4,
        //                 total: 120,
        //             }
        //         ],
        //         total: 165,
        //         paid: 0, // Not paid yet
        //     }
        // ];

        // Sale.insertMany(sales);

    })
    .catch((error) => console.log(error));
