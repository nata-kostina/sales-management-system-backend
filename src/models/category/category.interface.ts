import { IImage } from "../../types";

export interface ICategory {
    name: string;
    images: IImage[];
    shortDescription: string;
    longDescription: string;
}
