export enum EPayment {
    Paid = "Paid",
    Unpaid = "Unpaid",
    Refunded = "Refunded",
    Cancelled = "Cancelled",
    Declined = "Declined",
    Overdue = "Overdue",
}

export interface IPayment {
    name: EPayment;
    priority: number;
}
