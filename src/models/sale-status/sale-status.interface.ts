export enum ESaleStatus {
    Shipped = "Shipped",
    Delivered = "Delivered",
    Cancelled = "Cancelled",
    Returned = "Returned",
    InTransit = "In Transit",
    AwaitingPayment = "Awaiting Payment",
}

export interface ISaleStatus {
    name: ESaleStatus;
    priority: number;
}
