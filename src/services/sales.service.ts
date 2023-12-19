import { SalesDto } from "../dtos/sales/sales.dto";
import { Sales } from "../models/sales/sales.model";

class SalesService {
    public async getProducts(skip: number, limit: number): Promise<SalesDto[]> {
        const sales = await Sales.find().skip(skip).limit(limit);
        const salesDtos: SalesDto[] = sales.map((sale) => new SalesDto(sale));
        return [...salesDtos];
    }
}

export const salesService = new SalesService();
