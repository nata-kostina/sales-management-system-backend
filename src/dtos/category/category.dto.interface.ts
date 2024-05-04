import { IImage } from "../../types";

export interface ICategoryDto {
    id: string;
    name: string;
    images: IImage[];
    shortDescription: string | null;
    longDescription: string | null;
    deleted: boolean;
}
