import { FilterQuery } from "mongoose";
import { CustomerDto } from "../dtos/customer/customer.dto";
import { ICustomer } from "../models/customer/customer.interface";
import { Customer } from "../models/customer/customer.model";

class CustomerService {
    public async getCustomers(
        skip: number,
        limit: number,
        sort?: keyof CustomerDto,
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
        const customer = await Customer.findOne({ _id: id });
        const customerDto = new CustomerDto(customer);
        return customerDto;
    }

    public async updateCustomer(
        payload: ICustomer,
        id: string,
    ): Promise<CustomerDto> {
        const customer = await Customer.findOne({ _id: id });

        await customer.updateOne({ ...payload });

        const updatedCustomer = await Customer.findOne({ _id: id });

        const customerDto = new CustomerDto(updatedCustomer);
        return customerDto;
    }

    public async addCustomer(payload: ICustomer): Promise<CustomerDto> {
        const newCustomer = await Customer.create(payload);
        const customer = await Customer.findOne({ _id: newCustomer._id });

        const customerDto = new CustomerDto(customer);
        return customerDto;
    }

    public async deleteCustomer(customers: string[]): Promise<void> {
        await Customer.deleteMany({ _id: { $in: customers } });
    }

    public async getCustomersList(name?: string): Promise<{ customers: CustomerDto[]; }> {
        const filter: FilterQuery<ICustomer> = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        console.log({ filter });
        const customers = await Customer.find(filter);

        const customerDtos: CustomerDto[] = customers.map(
            (customer) => new CustomerDto(customer),
        );
        return { customers: customerDtos };
    }
}

export const customerService = new CustomerService();
