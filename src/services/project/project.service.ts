import { Injectable, OnInit } from '@angular/core';
import { Subject, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Project } from 'src/models/project';
import { arrayUnion } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements OnInit {
  projectCollectionRef = this.afs.collection('projects');
  userCollectionRef = this.afs.collection('users');

  userId;
  projectsAsJson: Subject<any> = new Subject;

  currentId: string = 'RZBeLLA42nyPUOu5L9NA';
  showDialog = new Subject<boolean>;

  constructor(
    public afs: AngularFirestore, // Inject Firebase auth service
  ) { }

  ngOnInit(): void {

  }

  saveNewTask(data: any) {
    console.log('TASK DATA', data);
    console.log('project id', this.currentId);
    
    
    this.projectCollectionRef.doc(this.currentId)
    .collection('tasks').add(data)
    .then((docRef) => {
      console.log('docRef', docRef);
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
        this.currentId = docRef.id
        this.updateProjectsFromUser(projectData.projectOwnerId, docRef.id)
      })
  }

  updateProjectsFromUser(userId, projectId) {
    this.userCollectionRef.doc(userId).update({ projects: arrayUnion(projectId) })
    this.getProjectsAsJson(userId);
  }

  getProjectsAsJson(userId) {
    let projectsData: any[] = [];
    this.userId = userId;

    // get projectIds for current User...
    const usersDocRef: AngularFirestoreDocument<any> = this.userCollectionRef.doc(userId);

    // Unbedingt nochmal durchgehen, um das zu verstehen!!!!!!!
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

    this.projectsAsJson.next(projectsData)
  }
}


