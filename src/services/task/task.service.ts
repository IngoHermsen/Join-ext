import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, from, map, mergeMap, switchMap } from 'rxjs';
import { Task } from 'src/models/task';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Contact } from 'src/models/contact';
import { Router } from '@angular/router';
import { ProjectService } from '../project/project.service';
import { Timestamp } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasksByStatus: any;
  editMode: boolean = false;
  activeTask: BehaviorSubject<Task | null> = new BehaviorSubject(null)
  newTask: Subject<Task> = new Subject;
  amountOfTasks: number = null;
  amountOfUrgent: number = null;
  earliestDueDate: Subject<Timestamp> = new Subject();

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
    let amountOfTasks: number = 0;
    let earliestDueDate: Timestamp = null;
    let amountOfUrgent: number = 0;

    let tasksByStatus = {
      todo: [],
      inProgress: [],
      inReview: [],
      done: []
    };


    const tasksCollectionRef: AngularFirestoreCollection<any> = projectDocRef.collection('tasks')

    tasksCollectionRef.get().pipe(mergeMap(ref => {
      return from(ref.docs);
    })).pipe(map(doc => {
      const task = doc.data();
      const status = task.status;

      if (earliestDueDate == null || earliestDueDate > task.dueDate) {
        earliestDueDate = task.dueDate
      }

      if (this.checkUrgency(task.dueDate)) {
        amountOfUrgent++;
      }
      tasksByStatus[status].push(task);
      amountOfTasks++
    }))
      .subscribe((ref) => {
        this.earliestDueDate.next(earliestDueDate)
        this.amountOfTasks = amountOfTasks;
        this.amountOfUrgent = amountOfUrgent;
        this.tasksByStatus = tasksByStatus;

      })
  }

  checkUrgency(timestamp: Timestamp) {    
    const date = new Date()
    const dateAsSeconds = Date.parse(date.toString()) / 1000;
    const differenceInSeconds = timestamp.seconds - dateAsSeconds;
    const differenceInDays = (differenceInSeconds / 60 / 60 / 24)
    
    return differenceInDays <= 5;
  }

}
