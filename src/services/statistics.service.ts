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
        const sales = await Sale.find({ deleted: false });
        const { maxDate, minDate } = await this.getMinMaxSalesDates();
        const data: SaleStatisticsByCategoriesData = [];
        const header = await Category.find().then((res) => res.map((category) => category.name));

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
            data.push(header);
            const sortedMonthlyByCategory: Record<string, Record<string, number>> = {};
            monthNames.forEach((month) => {
                if (monthlyByCategory.hasOwnProperty(month)) {
                    sortedMonthlyByCategory[month] = monthlyByCategory[month];
                }
            });
            Object.keys(sortedMonthlyByCategory).forEach((month) => {
                const valuesArr = new Array(header.length - 1).fill(0);
                const monthStatistics = sortedMonthlyByCategory[month];
                header.forEach((category, idx) => {
                    const categoryStatistics = monthStatistics[category];
                    if (categoryStatistics !== undefined) {
                        valuesArr[idx - 1] = categoryStatistics;
                    }
                });
                data.push([month, ...valuesArr]);
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
            const years = Object.keys(yearlyByCategory).sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));
            const sortedYearlyByCategory: Record<string, Record<string, number>> = {};
            years.forEach((year) => {
                sortedYearlyByCategory[year] = yearlyByCategory[year];
            });
            Object.keys(sortedYearlyByCategory).forEach((year) => {
                const valuesArr = new Array(header.length - 1).fill(0);
                const yearStatistics = sortedYearlyByCategory[year];
                header.forEach((category, idx) => {
                    const categoryStatistics = yearStatistics[category];
                    if (categoryStatistics !== undefined) {
                        valuesArr[idx - 1] = categoryStatistics;
                    }
                });
                data.push([year, ...valuesArr]);
            });
        }
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
        if (Array.isArray(minmax) && minmax[0]?.minDate && minmax[0]?.maxDate) {
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

        console.log({currentDate});
        console.log({currentDayOfWeek});
        console.log({currentYear});
        console.log({currentMonth});
        console.log({currentDay});

        const currentWeekStartDate = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek);
        const currentWeekEndDate = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek + 6, 23, 59, 59, 999);
        console.log({currentWeekStartDate});
        console.log({currentWeekEndDate});
        const previousWeekStartDate = new Date(currentWeekStartDate);
        previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
        console.log({previousWeekStartDate});
        const previousWeekEndDate = new Date(currentWeekEndDate);
        previousWeekEndDate.setDate(previousWeekEndDate.getDate() - 7);
        console.log({previousWeekEndDate});
        // mongo: 2024-06-16T22:00:00.000+00:00
        // curr : 2024-06-16T22:00:00.000Z
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
        console.log({currentWeekPipeline});

        const currentWeekSales = await Sale.aggregate<{
            _id: null;
            totalCurrentWeekSales: number;
        }>(currentWeekPipeline);
        console.log({currentWeekSales});
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
