export class Task {
    taskId: string;
    title: string;
    description: string;
    assignedUsers: any[];
    creationDate: Date;
    dueDate: Date;
    priority: string[];
    status: string;

    constructor(obj?: any) {
        this.taskId = obj.taskId;
        this.title = obj.title;
        this.description = obj.description;
        this.assignedUsers = obj.assignedUsers;
        this.creationDate = obj.creationDate;
        this.dueDate = obj.dueDate;
        this.priority = obj.priority;
        this.status = obj.status;
    }
}