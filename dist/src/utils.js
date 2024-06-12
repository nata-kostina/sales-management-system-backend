import mongoose from "mongoose";
import { Customer } from "./models/customer/customer.model";
import { Payment } from "./models/payment/payment.model";
import { Product } from "./models/product/product.model";
import { SaleStatus } from "./models/sale-status/sales-status.model";
export const sortByPriority = (a, b, type = "asc") => {
    return type === "asc" ? a.priority - b.priority : b.priority - a.priority;
};
export const createDateForFile = () => {
    const date = new Date();
    const day = (`0${date.getDate()}`).slice(-2);
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const year = date.getFullYear();
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    const seconds = (`0${date.getSeconds()}`).slice(-2);
    return `${day}-${month}-${year}_${hours}_${minutes}_${seconds}`;
};
export const createDateForCsv = (value) => {
    return new Date(+value).toISOString().split("T")[0];
};
const streets = ["Maple", "Oak", "Cedar", "Elm", "Pine", "Main", "Elmwood", "Park", "Washington", "Lake"];
const streetSuffixes = ["Street", "Avenue", "Road", "Boulevard", "Parkway", "Heights"];
const apartmentNumbers = ["101", "202", "303", "404", "505", "606", "707", "808", "909", "1001"];
export function generateRandomAddress() {
    // Generate a random street name
    const randomStreetIndex = Math.floor(Math.random() * streets.length);
    const randomStreet = streets[randomStreetIndex];
    // Generate a random street suffix
    const randomSuffixIndex = Math.floor(Math.random() * streetSuffixes.length);
    const randomSuffix = streetSuffixes[randomSuffixIndex];
    // Generate a random house number (between 1 and 100)
    const randomHouseNumber = Math.floor(Math.random() * 100) + 1;
    // Generate a random apartment number
    const randomApartmentNumber = apartmentNumbers[Math.floor(Math.random() * apartmentNumbers.length)];
    // Concatenate street, suffix, house number, and apartment number into a single string
    return `${randomStreet} ${randomSuffix} ${randomHouseNumber}, Apt. ${randomApartmentNumber}`;
}
export const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec",
];
export const generateSales = async () => {
    const getRandom = (min, max) => {
        return Math.round(Math.random() * (max - min) + min);
    };
    const months31 = [1, 3, 5, 7, 8, 10, 12];
    const randomDate = () => {
        const year = getRandom(2022, 2024);
        const month = year === 2024 ? getRandom(1, 4) : getRandom(1, 12);
        const date = months31.includes(month) ? getRandom(1, 31) : month === 2 ? getRandom(1, 28) : getRandom(1, 30);
        const result = `${year}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}T11:00:00`;
        return result;
    };
    const totalPayments = ["65d84cf0ed0d25528acfc5cc", "65d84cf0ed0d25528acfc5d0"];
    const products = await Product.find();
    const productsIdsPrices = products.map((p) => ({ id: p._id.toString(), price: p.price }));
    const customers = await Customer.find();
    const customersIds = customers.map((c) => c._id.toString());
    const payments = await Payment.find();
    const paymentsIds = payments.map((c) => c._id.toString());
    const statuses = await SaleStatus.find();
    const statusesIds = statuses.map((c) => c._id.toString());
    const randomProducts = () => {
        const productsNum = getRandom(1, 3);
        const products = [];
        const randomIds = [];
        let total = 0;
        for (let i = 0; i < productsNum; i++) {
            let randomId = null;
            while (randomId === null || randomIds.includes(randomId)) {
                randomId = getRandom(0, productsIdsPrices.length - 1);
            }
            const quantity = getRandom(1, 10);
            const product = {
                product: new mongoose.Types.ObjectId(productsIdsPrices[randomId].id),
                price: productsIdsPrices[randomId].price,
                quantity,
                total: quantity * productsIdsPrices[randomId].price,
            };
            total += quantity * productsIdsPrices[randomId].price;
            products.push(product);
        }
        return { products, total };
    };
    const allSales = [];
    for (let i = 0; i < 200; i++) {
        const { products, total } = randomProducts();
        const payment = paymentsIds[getRandom(0, paymentsIds.length - 1)];
        const paid = totalPayments.includes(payment) ? total : 0;
        const id = (i + 4).toString();
        const sale = {
            reference: id.padStart(4, "0"),
            date: new Date(randomDate()),
            payment: new mongoose.Types.ObjectId(payment),
            status: new mongoose.Types.ObjectId(statusesIds[getRandom(0, statusesIds.length - 1)]),
            customer: new mongoose.Types.ObjectId(customersIds[getRandom(0, customersIds.length - 1)]),
            products,
            total,
            paid,
            deleted: false,
        };
        allSales.push(sale);
    }
    allSales.sort((a, b) => +new Date(a.date) - (+(new Date(b.date))));
    allSales.forEach((s, idx) => { s.reference = ((idx + 1).toString()).padStart(4, "0"); });
    JSON.stringify(allSales);
};
//# sourceMappingURL=utils.js.map