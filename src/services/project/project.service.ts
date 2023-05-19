import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Project } from 'src/models/project';
import { arrayUnion } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  currentId = new BehaviorSubject('')
  showDialog = new Subject<boolean>;

  constructor(
    public afs: AngularFirestore, // Inject Firebase auth service
  ) {

  }

  getUserId() {
    let userItem = localStorage.getItem('user');
    let userObject = JSON.parse(userItem);
    return userObject.uid;
  }

  updateProjectsFromUser(userId, projectId) {
    let userCollectionRef = this.afs.collection('users');
    userCollectionRef.doc(userId).update({projects: arrayUnion(projectId)})
  }


  createNewProject(object) {
    let projectCollectionRef = this.afs.collection('projects')
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
    projectCollectionRef.add(projectData)
      .then((docRef) => {
        docRef.update({ projectId: docRef.id })
        this.currentId.next(docRef.id)
        this.updateProjectsFromUser(projectData.projectOwnerId, docRef.id)
      })

  }

}
