import { User } from "./user";

export class Kitchen {
    id: number;
    tenantId: number;
    name: string;
    summary: string;
    users: User[];
}