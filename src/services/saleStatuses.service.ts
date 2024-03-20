import { SaleStatusDto } from "../dtos/sale-status/sale-status.dto";
import { SaleStatus } from "../models/sale-status/sales-status.model";
import { sortByPriority } from "../utils";

class SaleStatusesService {
    public async getSaleStatuses(): Promise<SaleStatusDto[]> {
        const saleStatuses = await SaleStatus.find();
        const saleStatusesDtos: SaleStatusDto[] = saleStatuses.sort(sortByPriority).map(
            (status) => new SaleStatusDto(status),
        );
        return [...saleStatusesDtos];
    }
}

export const saleStatusesService = new SaleStatusesService();
