import { Item } from "./item";

export class ItemCategory {
    id: number;
    tenantId: number;
    name: string;
    parentCategoryId: number;
    items: Item[];
}