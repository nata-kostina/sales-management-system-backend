import { IImage } from "../../types";

export interface ICategory {
    name: string;
    images: IImage[];
    shortDescription: string;
    longDescription: string;
    deleted: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ICategoryCsvItem = Record<string, any> & {
    name: string;
    short_description: string;
    long_description: string;
};
