import { IImage } from "../../types";

export interface ICategoryDb {
    name: string;
    images: IImage[];
    shortDescription: string | null;
    longDescription: string | null;
}
