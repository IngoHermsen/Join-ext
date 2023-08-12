import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Project } from 'src/models/project';
import { arrayUnion } from "firebase/firestore";
import { TaskService } from '../task/task.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements OnInit {
  projectCollectionRef = this.afs.collection('projects');
  userCollectionRef = this.afs.collection('users');

  userId: string;
  projectsAsJson: Subject<any> = new Subject;
  projectTitle: string = null;

  currentId: BehaviorSubject<string> = new BehaviorSubject('');
  showDialog = new Subject<boolean>;

  constructor(
    public afs: AngularFirestore,
    public taskService: TaskService,
  ) {

  }

  ngOnInit(): void {
    const date = new Date()
    console.log('LOG', date.setUTCSeconds);
    
  }

  setActiveProject(projectId: string) { 
    this.currentId   
    const projectDocRef: AngularFirestoreDocument<any> = this.projectCollectionRef.doc(projectId);
    projectDocRef.get().pipe(map((ref) => {
      this.projectTitle = ref.data().projectTitle;
      return ref.data()
    }))
      .subscribe((data) => {
        this.taskService.setTasksAsObject(projectDocRef)
      })
  }

  saveNewTask(data: any) {
    const projectCollectionRef = this.projectCollectionRef.doc(this.currentId.getValue())
    if(data.taskId) {
      
      projectCollectionRef
      .collection('tasks').doc(data.taskId).update({
        title: data.title,
        description: data.description,
        assignedUsers: data.assignedUsers,
        dueDate: data.dueDate,
        priority: data.priority,
      })

    } else
      projectCollectionRef
      .collection('tasks').add(data)
      .then((docRef) => {
        
        docRef.update({ taskId: docRef.id })
      })
   
  }

  createNewProject(object: any) {
    let projectData = new Project;

    projectData = {
      projectId: '',
      projectTitle: object.title,
      projectDescription: object.description,
      projectOwnerId: this.userId,
      tasks: []
    }

    // the following creates a firebase document with the projectData 
    // and then immediately updates the doc's 'projectId' with its own doc ID as value
    this.projectCollectionRef.add(projectData)
      .then((docRef) => {
        docRef.update({ projectId: docRef.id })
        this.currentId.next(docRef.id)
        this.updateProjectsFromUser(projectData.projectOwnerId, docRef.id)
      })
  }

  updateProjectsFromUser(userId: string, projectId: string) {
    this.userCollectionRef.doc(userId).update({ projects: arrayUnion(projectId) })
    this.getProjectsAsJson(userId);
  }

  getProjectsAsJson(userId: string) {      
    let projectsData: any[] = [];
    this.userId = userId;

    // get projectIds for current User...
    const usersDocRef: AngularFirestoreDocument<any> = this.userCollectionRef.doc(userId);

    usersDocRef.get().pipe(mergeMap((ref) => {
      const usersProjectIds = ref.data().projects;     

      return from(usersProjectIds).pipe(map((id) => {
        return id
      }));
    })).pipe(map((id: any) => {
      let projectDocRef: AngularFirestoreDocument = this.projectCollectionRef.doc(id);
      return projectDocRef
    })).subscribe((ref) => {
      ref.get().subscribe((ref) => {
        projectsData.push(ref.data());
      })
    });

    this.projectsAsJson.next(projectsData);
  }

  setLatestProjectInUserDoc(id) {
    const currentUserAsJson = JSON.parse(localStorage.getItem('user'));
    const currentUserId: string = currentUserAsJson.uid
    

    this.userCollectionRef.doc(currentUserId)
    .update({ latestActiveProject: id })
    
  }
}


