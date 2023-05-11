export class Project {
    title: string;
    description: string;
    category: string;
    assignedUsers: any[];
    creationTimeStamp: string;
    dueDateTimeStamp: number;
    priority: string[];

    constructor(obj: any) {
        this.title = obj.title;
        this.description = obj.description;
        this.assignedUsers = obj.assignedUsers;
        this.creationTimeStamp = obj.creationTimeStamp;
        this.dueDateTimeStamp = obj.dueDateTimeStamp;
        this.priority = obj.priority;
    }
}