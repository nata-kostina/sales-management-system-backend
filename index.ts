console.log("Hi");
// import "dotenv/config";
// import express from "express";
// import morgan from "morgan";
// import cors from "cors";
// // import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import path from "path";
// import { __dirname } from "./constants";
// import { authRouter } from "./src/routers/auth.router.js";
// import { errorMiddleware } from "./src/middlewares/error.middleware.js";
// import { productRouter } from "./src/routers/product.router.js";
// import { categoryRouter } from "./src/routers/category.router.js";
// import { customerRouter } from "./src/routers/customer.router.js";
// import { saleRouter } from "./src/routers/sale.router.js";
// import { brandRouter } from "./src/routers/brands.router.js";
// import { unitRouter } from "./src/routers/unit.router.js";
// import { saleStatusesRouter } from "./src/routers/saleStatuses.router";
// import { paymentRouter } from "./src/routers/payment.router";
// import { statisticsRouter } from "./src/routers/statistics.router";

// /* SERVER CONFIGURATION */
// const app = express();

// app.use(morgan("common"));

// app.use(
//     cors({
//         origin: process.env.SITE_URL,
//         credentials: true,
//     }),
// );
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
//     next();
// });
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const PORT = process.env.PORT || 9000;

// /* ROUTERS */
// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });
// app.use("/api/auth", authRouter);
// app.use("/api/categories", categoryRouter);
// app.use("/api/customers", customerRouter);
// app.use("/api/sales", saleRouter);
// app.use("/api/products", productRouter);
// app.use("/api/brands", brandRouter);
// app.use("/api/units", unitRouter);
// app.use("/api/statuses", saleStatusesRouter);
// app.use("/api/payment", paymentRouter);
// app.use("/api/statistics", statisticsRouter);

// /* ERROR HANDLER MIDDLEWARE */

// app.use(errorMiddleware);

// app.listen(PORT, () =>
//     console.log(`Server is listening on port ${PORT}`),
// );

// /* MONGOOSE CONFIGURATION */
// // mongoose
// //     .connect(process.env.MONGO_URL)
// //     .then(() => {
// //         app.listen(PORT, () =>
// //             console.log(`Server is listening on port ${PORT}`),
// //         );
// //     })
// //     .catch((error) => console.log(error));
