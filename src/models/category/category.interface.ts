import { IImage } from "../../types";

export interface ICategory {
    name: string;
    images: IImage[];
    shortDescription: string | null;
    longDescription: string | null;
    deleted: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ICategoryCsvItem = Record<string, any> & {
    name: string;
    short_description: string;
    long_description: string;
};
