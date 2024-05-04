import { PipelineStage, Types } from "mongoose";
import { ICustomer } from "../models/customer/customer.interface";
import { Sale } from "../models/sale/sale.model";
import {
    IGetGeneralStatisticsResponse,
    IGetSalesStatisticsByCategoriesResponse,
    IGetSalesStatisticsResponse,
    SaleStatisticsByCategoriesData,
    SaleStatisticsData,
    SaleStatisticsOption,
} from "../types";
import { monthNames } from "../utils";
import { Product } from "../models/product/product.model";
import { ICategory } from "../models/category/category.interface";
import { ProductDto } from "../dtos/product/product.dto";
import { Category } from "../models/category/category.model";

class StatisticsService {
    public async getSalesStatistics(option: string, year: string | null): Promise<IGetSalesStatisticsResponse> {
        const sales = await Sale.find({ deleted: false });
        const { maxDate, minDate } = await this.getMinMaxSalesDates();
        let data: SaleStatisticsData = [];

        if (option === SaleStatisticsOption.ByMonth) {
            const yearParameter = year ? +year : new Date().getFullYear();
            const currentYearSales = sales.filter((sale) => sale.date.getFullYear() === yearParameter);
            if (currentYearSales.length === 0) {
                return {
                    data: [],
                    minDate,
                    maxDate,
                };
            }
            const monthlyTotal: SaleStatisticsData = [];
            for (let i = 0; i < monthNames.length; i++) {
                monthlyTotal.push([monthNames[i], 0]);
            }

            for (let i = 0; i < currentYearSales.length; i++) {
                const month = currentYearSales[i].date.getMonth();
                monthlyTotal[month][1] += currentYearSales[i].paid;
            }

            data = monthlyTotal;
        } else {
            if (sales.length === 0) {
                return {
                    data: [],
                    minDate,
                    maxDate,
                };
            }
            const yearlyTotal: SaleStatisticsData = [];
            const minYear = minDate.getFullYear();
            const maxYear = maxDate.getFullYear();

            for (let i = minYear; i <= maxYear; i++) {
                yearlyTotal.push([i.toString(), 0]);
            }
            for (let i = 0; i < sales.length; i++) {
                const saleYear = sales[i].date.getFullYear();
                yearlyTotal[yearlyTotal.length - 1 - (maxYear - saleYear)][1] += sales[i].paid;
            }

            data = yearlyTotal;
        }

        return { data, minDate, maxDate };
    }

    public async getGeoSalesStatistics(year: string | null): Promise<IGetSalesStatisticsResponse> {
        const { maxDate, minDate } = await this.getMinMaxSalesDates();
        // let sales: ISale[] = await Sale.find();
        let sales = await Sale.find({ deleted: false }).populate<{
            customer: ICustomer & { _id: Types.ObjectId; };
        }>("customer", "country");

        const data: SaleStatisticsData = [];

        if (year && year.toLowerCase() !== "all") {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31 23:59:59`);
            sales = sales.filter((sale) => sale.date >= startDate && sale.date <= endDate);
        }
        const totalByCountry: Record<string, number> = {};
        sales.forEach((sale) => {
            if (totalByCountry[sale.customer.country.name]) {
                totalByCountry[sale.customer.country.name] += sale.paid;
            } else {
                totalByCountry[sale.customer.country.name] = sale.paid;
            }
        });
        Object.entries(totalByCountry).forEach(([key, value]) => {
            data.push([key, value]);
        });
        return { data, minDate, maxDate };
    }

    public async getCategoriesSalesStatistics(option: string, year: string | null): Promise<IGetSalesStatisticsByCategoriesResponse> {
        console.log({ option });
        console.log({ year });
        const sales = await Sale.find({ deleted: false });
        const { maxDate, minDate } = await this.getMinMaxSalesDates();
        const data: SaleStatisticsByCategoriesData = [];
        const header = await Category.find().then((res) => res.map((category) => category.name));
        const categoriesNum = header.length;

        if (option === SaleStatisticsOption.ByMonth) {
            header.splice(0, 0, "Month");

            const yearParameter = year ? +year : new Date().getFullYear();
            const currentYearSales = sales.filter((sale) => sale.date.getFullYear() === yearParameter);
            if (currentYearSales.length === 0) {
                return {
                    data: [],
                    minDate,
                    maxDate,
                };
            }

            const monthlyByCategory: Record<string, Record<string, number>> = {};

            for (let i = 0; i < currentYearSales.length; i++) {
                const month = currentYearSales[i].date.getMonth();
                for (const product of currentYearSales[i].products) {
                    const productDb = await Product.findOne({ _id: product.product }).populate<{
                        categories: Array<ICategory & { _id: Types.ObjectId; }>;
                    }>("categories");
                    if (productDb) {
                        for (let i = 0; i < productDb.categories.length; i++) {
                            const category = productDb.categories[i].name;
                            if (monthlyByCategory[monthNames[month]]?.[category]) {
                                monthlyByCategory[monthNames[month]][category] += product.quantity;
                            } else {
                                if (!monthlyByCategory[monthNames[month]]) {
                                    monthlyByCategory[monthNames[month]] = {};
                                }
                                monthlyByCategory[monthNames[month]][category] = product.quantity;
                            }
                        }
                    }
                }
            }
            // const
            data.push(header);
            Object.keys(monthlyByCategory).forEach((key) => {
                const keyValues = Object.values(monthlyByCategory[key]);
                data.push([key, ...keyValues]);
            });
        } else {
            if (sales.length === 0) {
                return {
                    data: [],
                    minDate,
                    maxDate,
                };
            }
            header.splice(0, 0, "Year");
            data.push(header);
            const yearlyByCategory: Record<string, Record<string, number>> = {};
            for (let i = 0; i < sales.length; i++) {
                const saleYear = sales[i].date.getFullYear();
                for (const product of sales[i].products) {
                    const productDb = await Product.findOne({ _id: product.product }).populate<{
                        categories: Array<ICategory & { _id: Types.ObjectId; }>;
                    }>("categories");
                    if (productDb) {
                        for (let i = 0; i < productDb.categories.length; i++) {
                            const category = productDb.categories[i].name;
                            if (yearlyByCategory[saleYear]?.[category]) {
                                yearlyByCategory[saleYear][category] += product.quantity;
                            } else {
                                if (!yearlyByCategory[saleYear]) {
                                    yearlyByCategory[saleYear] = {};
                                }
                                yearlyByCategory[saleYear][category] = product.quantity;
                            }
                        }
                    }
                }
            }
            Object.keys(yearlyByCategory).forEach((key) => {
                const keyValues = Object.values(yearlyByCategory[key]);
                data.push([key, ...keyValues]);
            });
        }
        data.forEach((record) => {
            for (let i = record.length; i < categoriesNum + 1; i++) {
                record.push(0);
            }
        });
        return { data, minDate, maxDate };
    }

    public async getBestsellers(): Promise<ProductDto[]> {
        const sales = await Sale.find({ deleted: false });
        const soldProducts: Record<string, number> = {};
        for (const sale of sales) {
            for (const product of sale.products) {
                const productId = product.product.toString();
                if (soldProducts[productId]) {
                    soldProducts[productId] += product.quantity;
                } else {
                    soldProducts[productId] = product.quantity;
                }
            }
        }
        const soldProductsArray = Object.entries(soldProducts);
        soldProductsArray.sort((a, b) => b[1] - a[1]);
        const top5Products = soldProductsArray.slice(0, 5).map((item) => item[0]);
        const productDtos: ProductDto[] = [];
        for (const top of top5Products) {
            const product = await Product.findOne({ _id: top })
                .populate<{
                    brand: {
                        _id: Types.ObjectId;
                        name: string;
                    };
                }>("brand", "_id name")
                .populate<{
                    unit: {
                        _id: Types.ObjectId;
                        name: string;
                    };
                }>("unit", "_id name")
                .populate<{
                    categories: Array<ICategory & { _id: Types.ObjectId; }>;
                }>("categories");
            if (product) {
                productDtos.push(new ProductDto(product));
            }
        }

        return productDtos;
    }

    public async getGeneralStatistics(): Promise<IGetGeneralStatisticsResponse> {
        const sales = await Sale.find({ deleted: false });
        const total = sales.reduce((acc, curr) => acc + curr.paid, 0);
        const monthly = await this.getMonthlyStatistics();
        const weekly = await this.getWeeklyStatistics();

        return { total, monthly, weekly };
    }

    private async getMinMaxSalesDates(): Promise<{ minDate: Date; maxDate: Date; }> {
        const minmax = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    minDate: { $min: "$date" },
                    maxDate: { $max: "$date" },
                },
            },
        ]);
        console.log(minmax);
        if (minmax.length === 2) {
            const minDate = minmax[0].minDate;
            const maxDate = minmax[0].maxDate;
            return { maxDate, minDate };
        }
        const currentDate = new Date();
        return { maxDate: currentDate, minDate: currentDate };
    }

    private async getMonthlyStatistics(): Promise<{ amount: number; change: number; }> {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentMonthStartDate = new Date(currentYear, currentMonth, 1);
        const currentMonthEndDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

        const previousMonthStartDate = new Date(previousYear, previousMonth, 1);
        const previousMonthEndDate = new Date(previousYear, previousMonth + 1, 0, 23, 59, 59, 999);

        const currentMonthPipeline: PipelineStage[] = [
            {
                $match: {
                    date: {
                        $gte: currentMonthStartDate,
                        $lte: currentMonthEndDate,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalCurrentMonthSales: { $sum: "$paid" },
                },
            },
        ];

        const currentMonthSales = await Sale.aggregate<{
            _id: null;
            totalCurrentMonthSales: number;
        }>(currentMonthPipeline);

        const previousMonthPipeline: PipelineStage[] = [
            {
                $match: {
                    date: {
                        $gte: previousMonthStartDate,
                        $lte: previousMonthEndDate,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPreviousMonthSales: { $sum: "$paid" },
                },
            },
        ];
        const previousMonthSales = await Sale.aggregate<{
            _id: null;
            totalPreviousMonthSales: number;
        }>(previousMonthPipeline);

        let monthlyChange = 0;
        if (currentMonthSales.length > 0 && previousMonthSales.length > 0) {
            monthlyChange = ((currentMonthSales[0].totalCurrentMonthSales - previousMonthSales[0].totalPreviousMonthSales)
                / previousMonthSales[0].totalPreviousMonthSales) * 100;
        } else if (currentMonthSales.length > 0 && previousMonthSales.length === 0) {
            monthlyChange = 100;
        }
        return {
            amount: currentMonthSales.length > 0 ? currentMonthSales[0].totalCurrentMonthSales : 0,
            change: Math.round(monthlyChange),
        };
    }

    private async getWeeklyStatistics(): Promise<{ amount: number; change: number; }> {
        const currentDate = new Date();
        const currentDayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();

        const currentWeekStartDate = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek);
        const currentWeekEndDate = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek + 6, 23, 59, 59, 999);

        const previousWeekStartDate = new Date(currentWeekStartDate);
        previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);

        const previousWeekEndDate = new Date(currentWeekEndDate);
        previousWeekEndDate.setDate(previousWeekEndDate.getDate() - 7);

        console.log({
            currentWeekStartDate,
            currentWeekEndDate,
            previousWeekStartDate,
            previousWeekEndDate,
        });

        const currentWeekPipeline: PipelineStage[] = [
            {
                $match: {
                    date: {
                        $gte: currentWeekStartDate,
                        $lte: currentWeekEndDate,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalCurrentWeekSales: { $sum: "$paid" },
                },
            },
        ];

        const currentWeekSales = await Sale.aggregate<{
            _id: null;
            totalCurrentWeekSales: number;
        }>(currentWeekPipeline);

        const previousWeekPipeline: PipelineStage[] = [
            {
                $match: {
                    date: {
                        $gte: previousWeekStartDate,
                        $lte: previousWeekEndDate,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPreviousWeekSales: { $sum: "$paid" },
                },
            },
        ];
        const previousWeekSales = await Sale.aggregate<{
            _id: null;
            totalPreviousWeekSales: number;
        }>(previousWeekPipeline);

        console.log({ currentWeekSales });
        console.log({ previousWeekSales });
        // previous sales  = 100%
        // current - previous =  ?
        // ((current - previous) * 100) / previous sales
        let weeklyChange = 0;
        if (currentWeekSales.length > 0 && previousWeekSales.length > 0) {
            weeklyChange = ((currentWeekSales[0].totalCurrentWeekSales - previousWeekSales[0].totalPreviousWeekSales)
                / previousWeekSales[0].totalPreviousWeekSales) * 100;
        } else if (currentWeekSales.length > 0 && previousWeekSales.length === 0) {
            weeklyChange = 100;
        }
        return {
            amount: currentWeekSales.length > 0 ? currentWeekSales[0].totalCurrentWeekSales : 0,
            change: Math.round(weeklyChange),
        };
    }
}

export const statisticsService = new StatisticsService();
