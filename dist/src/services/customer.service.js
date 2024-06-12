import fs from "fs";
import * as csv from "fast-csv";
import path from "path";
import { CustomerDto } from "../dtos/customer/customer.dto";
import { Customer } from "../models/customer/customer.model";
import { generatedFilesPath } from "../../constants";
import { createDateForFile } from "../utils";
class CustomerService {
    async getCustomers(skip, limit, sort, order, name, email, country, state, city, phone) {
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (email) {
            filter.email = { $regex: email, $options: "i" };
        }
        if (country) {
            filter["country.name"] = { $regex: country, $options: "i" };
        }
        if (state) {
            filter["state.name"] = { $regex: state, $options: "i" };
        }
        if (city) {
            filter["city.name"] = { $regex: city, $options: "i" };
        }
        if (phone) {
            filter.phone = { $regex: phone };
        }
        filter.deleted = false;
        const customers = await Customer
            .find(filter)
            .sort({ [sort]: order === "ascend" ? 1 : -1 });
        const total = customers.length;
        const slicedCustomers = customers.slice(skip, skip + limit);
        const customerDtos = slicedCustomers.map((customer) => new CustomerDto(customer));
        return {
            customers: customerDtos,
            total,
        };
    }
    async getCustomer(id) {
        const customer = await Customer.findOne({ _id: id, deleted: false });
        const customerDto = new CustomerDto(customer);
        return customerDto;
    }
    async updateCustomer(payload, id) {
        const customer = await Customer.findOne({ _id: id, deleted: false });
        await customer.updateOne({ ...payload });
        const updatedCustomer = await Customer.findOne({ _id: id });
        const customerDto = new CustomerDto(updatedCustomer);
        return customerDto;
    }
    async addCustomer(payload) {
        const newCustomer = await Customer.create(payload);
        const customer = await Customer.findOne({ _id: newCustomer._id });
        const customerDto = new CustomerDto(customer);
        return customerDto;
    }
    async deleteCustomer(customers) {
        let customersToDelete;
        if (customers && customers.length > 0) {
            customersToDelete = await Customer.find({ _id: { $in: customers }, deleted: false });
        }
        else {
            customersToDelete = await Customer.find({ deleted: false });
        }
        for (const category of customersToDelete) {
            await Customer.updateOne({ _id: category._id }, { $set: { deleted: true } });
        }
    }
    async getCustomersList(name) {
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        const customers = await Customer.find(filter);
        const customerDtos = customers.map((customer) => ({ id: customer._id.toString(), name: customer.name }));
        return { customers: customerDtos };
    }
    async getCsv(customers) {
        const dbData = await Customer.find(customers.length === 0 ? { deleted: false } : { _id: { $in: customers }, deleted: false });
        return new Promise((resolve, reject) => {
            const fileName = path.join(generatedFilesPath, `customers_data_${createDateForFile()}.csv`);
            const csvFile = fs.createWriteStream(fileName);
            const data = [];
            for (const customer of dbData) {
                const info = {
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    country: customer.country.name ?? "",
                    state: customer.state.name ?? "",
                    city: customer.city.name ?? "",
                    address: customer.address ?? "",
                };
                data.push(info);
            }
            const headers = new Set();
            data.forEach((item) => {
                Object.keys(item).forEach((key) => {
                    headers.add(key);
                });
            });
            const headersArray = Array.from(headers);
            csvFile.write("sep=,\n");
            const csvStream = csv.format({ headers: headersArray });
            csvStream.pipe(csvFile);
            csvStream.on("end", () => {
                csvFile.end(() => resolve(fileName));
            });
            csvStream.on("error", () => reject());
            data.forEach(row => csvStream.write(row));
            csvStream.end();
        });
    }
}
export const customerService = new CustomerService();
//# sourceMappingURL=customer.service.js.map