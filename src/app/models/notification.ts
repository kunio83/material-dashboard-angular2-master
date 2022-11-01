export class Notification{
    id: number;
    title: string;
    description: string;
    date: Date;
    type: string;
    readed: boolean;
    
    constructor(id: number, title: string, description: string, date: Date, type: string, readed: boolean){
        this.id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.type = type;
        this.readed = readed;
    }
}