export interface ICustomer {
    name: string;
    phone: string;
    email: string;
    country: {
        id: number;
        name: string;
    };
    state: {
        id: number;
        name: string;
    };
    city: {
        id: number;
        name: string;
    };
    address: string;
    deleted: boolean;
}
