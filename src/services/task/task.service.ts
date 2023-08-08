import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Task } from 'src/models/task';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Contact } from 'src/models/contact';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  editMode: boolean = false;
  activeTask: BehaviorSubject<Task | null> = new BehaviorSubject(null)
  newTask: Subject<Task> = new Subject;

  constructor(
    public afs: AngularFirestore,
    public router: Router
  ) { }

  updateTaskDocumentStatus(status: string, taskId: string, projectId: string) {
    const projectCollectionRef: AngularFirestoreCollection<any> = this.afs.collection('projects');
    const projectDocRef: AngularFirestoreDocument<any> = projectCollectionRef.doc(projectId);
    const taskCollectionRef: AngularFirestoreCollection<any> = projectDocRef.collection('tasks');
    const taskDocumentRef: AngularFirestoreDocument<any> = taskCollectionRef.doc(taskId);
    taskDocumentRef.update({ status: status });
    console.log(status);

  }

  createNewTask(object) {
    let taskData = new Task(object);

    taskData = {
      taskId: '',
      title: object.title,
      description: object.description,
      assignedUsers: this.reduceContactData(object.assignedUsers),
      creationDate: new Date(),
      dueDate: object.dueDate,
      priority: object.priority,
      status: 'todo'
    }

    console.log('TASK DATA', taskData);

    this.newTask.next(taskData)
  }

  reduceContactData(assignedUsersAsContacts: Array<Contact>) {
    const reducedData: Array<any> = [];
    assignedUsersAsContacts.forEach((user) => {
      let reducedObject = {
        displayName: user.firstName + " " + user.lastName,
        uid: user.uid,
        initials: user.initials,
        email: user.email
      }
      reducedData.push(reducedObject)
    })
    return reducedData
  }


  transformDueDate(timestampSeconds: number, asDate?: boolean) {
    const dueDateAsDate = new Date(timestampSeconds * 1000);
    if (asDate) {
      return dueDateAsDate.toString();
    } else {
      return dueDateAsDate.toLocaleDateString();
    }
  }
}
