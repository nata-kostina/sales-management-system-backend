import { CustomerDto } from "../dtos/customer/customer.dto";
import { Customer } from "../models/customer/customer.model";

class CustomerService {
    public async getCustomers(
        skip: number,
        limit: number
    ): Promise<CustomerDto[]> {
        const customers = await Customer.find().skip(skip).limit(limit);
        const customerDtos: CustomerDto[] = customers.map(
            (customer) => new CustomerDto(customer)
        );
        return [...customerDtos];
    }
}

export const customerService = new CustomerService();
