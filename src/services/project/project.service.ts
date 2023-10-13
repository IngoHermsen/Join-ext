import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Project } from 'src/models/project';
import { arrayUnion } from "firebase/firestore";
import { TaskService } from '../task/task.service';


@Injectable({
  providedIn: 'root'
})
export class ProjectService implements OnInit {
  fbProjectRefCollection: AngularFirestoreCollection = null;
  fbContactRefCollection: AngularFirestoreCollection = null;
  usersCollectionRef = this.afs.collection('users');
  isGuestSession: boolean = false;

  activeUserId: string;
  projectsAsJson: Subject<any> = new Subject;
  projectTitle: string = null;
  projectDropdownItems: any[] = [];

  currentId: BehaviorSubject<string> = new BehaviorSubject('');
  showDialog = new Subject<boolean>;
  taskUpdates: Subject<any> = new Subject;

  constructor(
    public afs: AngularFirestore,
    public taskService: TaskService,

  ) {
    this._setFirebaseProjectsCollection()
  }

  ngOnInit(): void {
  }

  _setFirebaseProjectsCollection() {
    let projectsCollectionName: string;
    this.activeUserId = JSON.parse(localStorage.getItem('user')).uid;
    if (this.activeUserId == 'LEhjHR9pKMOYrlmeMx9LqHpl05z2') {
      projectsCollectionName = 'guest_projects';
      this.isGuestSession = true;
    } else {
      projectsCollectionName = 'projects';
    }

    this.fbProjectRefCollection = this.afs.collection(projectsCollectionName)
    console.log(this.fbProjectRefCollection);

  }

  setActiveProject(projectId: string) {
    const projectDocRef: AngularFirestoreDocument<any> = this.fbProjectRefCollection.doc(projectId);
    projectDocRef.get().pipe(map((ref) => {

      this.projectTitle = ref.data().projectTitle || "<no project>";

      return ref.data()
    }))
      .subscribe((data) => {
        this.taskService.setTasksAsObject(projectDocRef)
      })
  }

  saveNewTask(data: any) {
    const taskFormEntries = {
      title: data.title,
      description: data.description,
      assignedUsers: data.assignedUsers,
      dueDate: data.dueDate,
      priority: data.priority,
    }

    const fbProjectRefCollection = this.fbProjectRefCollection.doc(this.currentId.getValue())
    if (data.taskId) {
      fbProjectRefCollection
        .collection('tasks').doc(data.taskId).update(taskFormEntries)
        .then(() => {
          this.taskUpdates.next(taskFormEntries);
          this.addProjectToUserDocs(taskFormEntries.assignedUsers)
        })

    } else {
      fbProjectRefCollection
        .collection('tasks').add(data)
        .then((docRef) => {

          docRef.update({ taskId: docRef.id })
            .then(() => {
              this.taskService.setTaskAsObject(fbProjectRefCollection, docRef.id);
              if (!this.isGuestSession) {
                this.addProjectToUserDocs(taskFormEntries.assignedUsers);
              }

            })
        })
    }

  }


  createNewProject(object: any) {
    let projectData = new Project;

    projectData = {
      projectId: '',
      projectTitle: object.title,
      projectDescription: object.description,
      projectOwnerId: this.activeUserId,
      tasks: []
    }

    // the following creates a firebase document with the projectData 
    // and then immediately updates the doc's 'projectId' with its own doc ID as value
    this.fbProjectRefCollection.add(projectData)
      .then((docRef) => {
        docRef.update({ projectId: docRef.id })
        this.currentId.next(docRef.id)
        this.updateProjectsFromUser(projectData.projectOwnerId, docRef.id)
      })
  }

  updateProjectsFromUser(userId: string, projectId: string) {
    this.usersCollectionRef.doc(userId).update({ projects: arrayUnion(projectId) })
    this.getProjectsAsJson(userId);
  }

  getProjectsAsJson(userId: string) {
    let projectsData: any[] = [];

    // get projectIds for current User...
    const usersDocRef: AngularFirestoreDocument<any> = this.usersCollectionRef.doc(userId);

    usersDocRef.get().pipe(mergeMap(ref => {
      const usersProjectIds = ref.data().projects;

      return from(usersProjectIds).pipe(map((id) => {
        return id
      }));
    })).pipe(map((id: any) => {
      let projectDocRef: AngularFirestoreDocument = this.fbProjectRefCollection.doc(id);
      return projectDocRef
    })).subscribe(ref => {
      ref.get().subscribe(ref => {
        const projData = ref.data();

        projectsData.push(projData);
        this.projectDropdownItems.push(
          {
            label: projData['projectTitle'],
            id: projData['projectId'],
            command: () => {

              this.changeActiveProject(projData['projectId'])
            }
          }
        )
          ;
      })
    });

    this.projectsAsJson.next(projectsData);

  }

  setLatestProjectInUserDoc(projectId: string) {
    const currentUserAsJson = JSON.parse(localStorage.getItem('user'));
    const currentUserId: string = currentUserAsJson.uid

    this.usersCollectionRef.doc(currentUserId)
      .update({ latestActiveProject: projectId })

  }

  addProjectToUserDocs(users: Array<any>) {
    const userIds = users.map(user => user.uid)

    const userIdsObs$ = from(userIds);
    userIdsObs$.pipe(map(userId => {
      const usersDoc = this.usersCollectionRef.doc(userId)
      usersDoc.valueChanges()
        .subscribe(docData => {
          const projectId = this.currentId.getValue()
          const usersProjects: Array<string> = docData['projects'];
          console.log('usersProjects', usersProjects);

          if (usersProjects.indexOf(projectId) == -1) {
            usersDoc.update({ projects: arrayUnion(projectId) })
          }
        })
    })).subscribe()

  }


  changeActiveProject(projectId?: string) {
    let id = projectId;
    this.currentId.next(id);
    this.setLatestProjectInUserDoc(id)

    localStorage.setItem('activeProject', id);
  }


}


