import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, mergeMap, switchMap } from 'rxjs';
import { Task } from 'src/models/task';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Contact } from 'src/models/contact';
import { Router } from '@angular/router';
import { ProjectService } from '../project/project.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasksByStatus: any;
  editMode: boolean = false;
  activeTask: BehaviorSubject<Task | null> = new BehaviorSubject(null)
  newTask: Subject<Task> = new Subject;
  amountOfTasks: number = 0;

  constructor(
    public afs: AngularFirestore,
    public router: Router,
  ) {
    this.tasksByStatus = {
      todo: [],
      inProgress: [],
      inReview: [],
      done: []
    };  



  }

  updateTaskDocumentStatus(status: string, taskId: string, projectId: string) {
    const projectCollectionRef: AngularFirestoreCollection<any> = this.afs.collection('projects');
    const projectDocRef: AngularFirestoreDocument<any> = projectCollectionRef.doc(projectId);
    const taskCollectionRef: AngularFirestoreCollection<any> = projectDocRef.collection('tasks');
    const taskDocumentRef: AngularFirestoreDocument<any> = taskCollectionRef.doc(taskId);
    taskDocumentRef.update({ status: status });
  }

  saveTask(object: any, taskId: string | null) {
    let taskData = new Task(object);
    console.log('OBJECT', object);

    taskData = {
      taskId: taskId,
      title: object.title,
      description: object.description,
      assignedUsers: this.reduceContactData(object.assignedUsers),
      creationDate: new Date(),
      dueDate: object.dueDate,
      priority: object.priority,
      status: 'todo'
    }

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

  setTasksAsObject(projectDocRef: AngularFirestoreDocument) {
    this.amountOfTasks = 0;
    this.tasksByStatus = {
      todo: [],
      inProgress: [],
      inReview: [],
      done: []
    };

    const tasksCollectionRef: AngularFirestoreCollection<any> = projectDocRef.collection('tasks')

    tasksCollectionRef.get().pipe(mergeMap((ref) => {
      return ref.docs;
    })).subscribe((ref) => {
      const task = ref.data();
      const status = task.status;
      this.tasksByStatus[status].push(task); 
      this.amountOfTasks++
    })
  }
}
