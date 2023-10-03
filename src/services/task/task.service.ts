import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, from, map, mergeMap, switchMap } from 'rxjs';
import { Task } from 'src/models/task';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Contact } from 'src/models/contact';
import { Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';
import { ViewService } from '../view/view.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnInit {
  tasksByStatus: any;
  editMode: boolean = false;
  activeTask: BehaviorSubject<Task | null> = new BehaviorSubject(null)
  newTask: Subject<Task> = new Subject;
  addTaskToView: Subject<string> = new Subject;
  amountOfTasks: number = 0;
  amountOfUrgent: number = 0;
  earliestDueDateSubject: Subject<Timestamp> = new Subject();
  initTest: string = null;


  constructor(
    public afs: AngularFirestore,
    public router: Router,
    public viewService: ViewService,
  ) {        
    this.initTest = 'initiated';
    this.tasksByStatus = {
      todo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  ngOnInit() {

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


  transformDueDate(dueDate: Timestamp | Date) {
    if (dueDate instanceof Timestamp) {
      const secondsAsDate = new Date(dueDate.seconds * 1000);
      return secondsAsDate.toLocaleDateString();
    } else {
      return dueDate.toLocaleDateString();
    }
  }

  setTasksAsObject(projectDocRef: AngularFirestoreDocument) {
    let earliestDueDate: Timestamp = null;    
    this.earliestDueDateSubject.next(null);
    this.amountOfTasks = 0;
    this.tasksByStatus = {
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

      if (earliestDueDate == null || task.dueDate < earliestDueDate) {
        earliestDueDate = task.dueDate
      }

      if (this.checkUrgency(task.dueDate)) {
        this.amountOfUrgent++;
      }
      this.tasksByStatus[status].push(task);
      this.amountOfTasks++
    }))
      .subscribe((ref) => { 
        this.earliestDueDateSubject.next(earliestDueDate);
        
      })
  }

  setTaskAsObject(projectDocRef: AngularFirestoreDocument, taskId: string) {
    const tasksCollectionRef: AngularFirestoreCollection<any> = projectDocRef.collection('tasks')

    tasksCollectionRef.doc(taskId)
      .get()
      .pipe(map((doc) => {
        const task = doc.data();
        const status = task.status;

        if (this.checkUrgency(task.dueDate)) {
          this.amountOfUrgent++;
        }
        this.tasksByStatus[status].push(task);
        this.amountOfTasks++
      }))
      .subscribe()
  }


  checkUrgency(timestamp: Timestamp) {
    const date = new Date()
    const dateAsSeconds = Date.parse(date.toString()) / 1000;
    const differenceInSeconds = timestamp.seconds - dateAsSeconds;
    const differenceInDays = (differenceInSeconds / 60 / 60 / 24)

    return differenceInDays <= 5;
  }

}
