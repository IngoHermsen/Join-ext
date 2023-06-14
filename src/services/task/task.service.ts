import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from 'src/models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  newTask: Subject<any> = new Subject;
  showDialog: Subject<boolean> = new Subject;

  constructor() {

  }

  createNewTask(object) {    
    let taskData = new Task(object);

    taskData = {
      taskId: '',
      title: object.title,
      description: object.description,
      assignedUsers: object.assignedUsers,
      creationDate: new Date(),
      dueDate: object.dueDate,
      priority: object.priority,
      status: 'todo'
    }

    console.log('create new Task-Data', taskData)
    this.newTask.next(taskData)

  }
}
