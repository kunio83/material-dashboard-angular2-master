import { Item } from "./item";

export class TableService{
    id: number;
    tenantId: number;
    tableId: number;
    dinerUserId: number;
    diners: number;
    userId: number;
    serviceStateId: number;
    serviceStart: Date;
    serviceEnd: Date;
    paymentMethod: string;
    paymentReference: string;
    comment: string;
    items: Item[];
}
