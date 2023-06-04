import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Subject, mergeMap, switchMap } from 'rxjs';
import { ProjectService } from 'src/services/project/project.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {
  tasksByStatus: any = {
    todo: [],
    inProgress: [],
    inReview: [],
    done: []
  };

  btnItems: any = {

  }
  
  //subscriptions
  projectSubscription: any;

  constructor(
    public projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.setTasksAsObject(this.projectService.currentId.getValue());

    this.projectSubscription = this.projectService.currentId.subscribe((value) => {
      this.setTasksAsObject(value)
    })
  }

  setTasksAsObject(projectId: string) {
    
    // get taskIds for current project...
    const projectDocRef: AngularFirestoreDocument<any> = this.projectService.projectCollectionRef.doc(projectId);
    const tasksCollectionRef: AngularFirestoreCollection<any> = projectDocRef.collection('tasks')

    tasksCollectionRef.get().pipe(switchMap((ref) => {
      return ref.docs;
    })).subscribe((ref) => {
      const task = ref.data()
      const status = task.status
      console.log('task status', task.status);
      

      this.tasksByStatus[status].push(task);
    })

    console.log('tasks log',this.tasksByStatus);
    
  }
}
