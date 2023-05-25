import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Project } from 'src/models/project';
import { arrayUnion } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectCollectionRef = this.afs.collection('projects');
  userCollectionRef = this.afs.collection('users');

  userId: string;
  projectIds: any[];
  projectsAsJson: Subject<any> = new Subject;

  currentId = new BehaviorSubject('');
  showDialog = new Subject<boolean>;

  constructor(
    public afs: AngularFirestore, // Inject Firebase auth service
  ) {
    this.userId = this.getUserId()
  }

  getUserId() {
    let userItem = localStorage.getItem('user');
    let userObject = JSON.parse(userItem);
    return userObject.uid;
  }

  updateProjectsFromUser(userId, projectId) {
    this.userCollectionRef.doc(userId).update({ projects: arrayUnion(projectId) })
    this.getProjectsAsJson();
  }

  createNewProject(object) {
    let projectData = new Project;

    projectData = {
      projectId: '',
      projectTitle: object.title,
      projectDescription: object.description,
      projectOwnerId: this.getUserId(),
      tasks: []
    }

    // create a firebase document with the projectData and then immediately update the docs
    // 'projectId' with its own doc ID as value
    this.projectCollectionRef.add(projectData)
      .then((docRef) => {
        docRef.update({ projectId: docRef.id })
        this.currentId.next(docRef.id)
        this.updateProjectsFromUser(projectData.projectOwnerId, docRef.id)
      })
  }


  getProjectsAsJson() {
    let projectsData: any[] = [];

    // get projectIds for current User...
    const usersDocRef: AngularFirestoreDocument<any> = this.userCollectionRef.doc(this.userId);
    usersDocRef.get().subscribe(ref => {
      const projectIds = ref.data().projects;

      // ...then get project Data for each project Id...
      projectIds.forEach(projectId => {
        let projectDocRef = this.projectCollectionRef.doc(projectId);

        projectDocRef.get().subscribe((project) => {
          let projectAsObject = project.data()
          projectsData.push(projectAsObject);
        });    
      });
      this.projectsAsJson.next(projectsData)
    })
  }
}
