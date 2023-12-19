import { IImage } from "../../types";

export interface ICategoryDto {
    id: string;
    name: string;
    image: IImage;
    description: string;
}
