import { SaleStatusDto } from "../dtos/sale-status/sale-status.dto";
import { SaleStatus } from "../models/sale-status/sales-status.model";
import { sortByPriority } from "../utils";
class SaleStatusesService {
    async getSaleStatuses() {
        const saleStatuses = await SaleStatus.find();
        const saleStatusesDtos = saleStatuses.sort(sortByPriority).map((status) => new SaleStatusDto(status));
        return [...saleStatusesDtos];
    }
}
export const saleStatusesService = new SaleStatusesService();
//# sourceMappingURL=saleStatuses.service.js.map