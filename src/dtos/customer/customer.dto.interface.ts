export interface ICustomerDto {
    id: string;
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ICustomerCsvItem = Record<string, any> & {
    name: string;
    phone: string;
    email: string;
    country: string;
    state: string;
    city: string;
    address: string;
};
