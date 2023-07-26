import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from 'src/models/task';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  newTask: Subject<any> = new Subject;

  constructor(
    public afs: AngularFirestore
  ) {
    
  }

  updateTaskDocumentStatus(status: string, taskId: string, projectId: string) {
    const projectCollectionRef: AngularFirestoreCollection<any> = this.afs.collection('projects');
    const projectDocRef: AngularFirestoreDocument<any> = projectCollectionRef.doc(projectId);
    const taskCollectionRef: AngularFirestoreCollection<any> = projectDocRef.collection('tasks');
    const taskDocumentRef: AngularFirestoreDocument<any> = taskCollectionRef.doc(taskId);
    taskDocumentRef.update({status: status});
    console.log(status);
    
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

    // console.log('create new Task-Data', taskData)
    this.newTask.next(taskData)
  }
}
