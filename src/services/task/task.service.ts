import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from 'src/models/task';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Contact } from 'src/models/contact';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  newTask: Subject<Task> = new Subject;

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
}
