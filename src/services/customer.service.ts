import fs from "fs";
import * as csv from "fast-csv";
import path from "path";
import { FilterQuery } from "mongoose";
import { CustomerDto } from "../dtos/customer/customer.dto";
import { ICustomer } from "../models/customer/customer.interface";
import { Customer } from "../models/customer/customer.model";
import { generatedFilesPath } from "../../constants";
import { createDateForFile } from "../utils";
import { ICustomerCsvItem } from "../dtos/customer/customer.dto.interface";

class CustomerService {
    public async getCustomers(
        skip: number,
        limit: number,
        sort?: keyof ICustomer,
        order?: "ascend" | "descend",
        name?: string,
        email?: string,
        country?: string,
        state?: string,
        city?: string,
        phone?: string,
    ): Promise<{ customers: CustomerDto[]; total: number; }> {
        const filter: FilterQuery<ICustomer> = {};
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

        const customerDtos: CustomerDto[] = slicedCustomers.map(
            (customer) => new CustomerDto(customer),
        );
        return {
            customers: customerDtos,
            total,
        };
    }

    public async getCustomer(id?: string): Promise<CustomerDto> {
        const customer = await Customer.findOne({ _id: id, deleted: false });
        const customerDto = new CustomerDto(customer);
        return customerDto;
    }

    public async updateCustomer(
        payload: ICustomer,
        id: string,
    ): Promise<CustomerDto> {
        console.log("updateCustomer: ", payload);
        const customer = await Customer.findOne({ _id: id, deleted: false });
        await customer.updateOne({ ...payload });

        const updatedCustomer = await Customer.findOne({ _id: id });

        const customerDto = new CustomerDto(updatedCustomer);
        return customerDto;
    }

    public async addCustomer(payload: ICustomer): Promise<CustomerDto> {
        console.log("addCustomer: ", payload);

        const newCustomer = await Customer.create(payload);
        const customer = await Customer.findOne({ _id: newCustomer._id });

        const customerDto = new CustomerDto(customer);
        return customerDto;
    }

    public async deleteCustomer(customers?: string[]): Promise<void> {
        let customersToDelete;
        if (customers && customers.length > 0) {
            customersToDelete = await Customer.find({ _id: { $in: customers }, deleted: false });
        } else {
            customersToDelete = await Customer.find({ deleted: false });
        }
        for (const category of customersToDelete) {
            await Customer.updateOne({ _id: category._id }, { $set: { deleted: true } });
        }
    }

    public async getCustomersList(name?: string): Promise<{ customers: CustomerDto[]; }> {
        const filter: FilterQuery<ICustomer> = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        const customers = await Customer.find(filter);

        const customerDtos: CustomerDto[] = customers.map(
            (customer) => new CustomerDto(customer),
        );
        return { customers: customerDtos };
    }

    public async getCsv(customers: string[]): Promise<string> {
        const dbData = await Customer.find(customers.length === 0 ? { deleted: false } : { _id: { $in: customers }, deleted: false });
        return new Promise<string>((resolve, reject) => {
            const fileName = path.join(generatedFilesPath, `customers_data_${createDateForFile()}.csv`);
            const csvFile = fs.createWriteStream(fileName);

            const data: ICustomerCsvItem[] = [];
            for (const customer of dbData) {
                const info: ICustomerCsvItem = {
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

            const headers = new Set<string>();
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
