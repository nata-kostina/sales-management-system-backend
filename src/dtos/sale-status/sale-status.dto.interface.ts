import { ESaleStatus } from "../../models/sale-status/sale-status.interface";

export interface ISaleStatusDto {
    id: string;
    name: ESaleStatus;
    priority: number;
}
