import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Subject, map, mergeMap, switchMap } from 'rxjs';
import { Task } from 'src/models/task';
import { ProjectService } from 'src/services/project/project.service';
import { TaskService } from 'src/services/task/task.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {
  tasksByStatus: any;
  projectTitle: string = null;

  draggedTask: Task = null;
  draggedOverSection: string = null;

  //subscriptions
  projectSubscription: any;



  constructor(
    public projectService: ProjectService,
    public taskService: TaskService
  ) {
    addEventListener('dragstart', (e) => {
      addEventListener('dragend', (e) => {
        this.draggedTask = null;
        this.draggedOverSection = null;
      })

    })

  }

  ngOnInit(): void {
    this.projectSubscription = this.projectService.currentId.subscribe((value) => {

      this.tasksByStatus = {
        todo: [],
        inProgress: [],
        inReview: [],
        done: []
      };
      this.setActiveProject(value);
    })
  }

  setActiveProject(projectId: string) {
    const projectDocRef: AngularFirestoreDocument<any> = this.projectService.projectCollectionRef.doc(projectId);
    projectDocRef.get().pipe(map((ref) => {
      this.projectTitle = ref.data().projectTitle;
      return ref.data()
    }))
      .subscribe((data) => {
      })
    this.setTasksAsObject(projectDocRef);
  }

  setTasksAsObject(projectDocRef: AngularFirestoreDocument) {
    const tasksCollectionRef: AngularFirestoreCollection<any> = projectDocRef.collection('tasks')

    tasksCollectionRef.get().pipe(switchMap((ref) => {
      return ref.docs;
    })).subscribe((ref) => {
      const task = ref.data();
      const status = task.status;
      this.tasksByStatus[status].push(task);
    })
  }

  dragStart(task: Task) {
    this.draggedTask = task;

  }

  drop(status: string) {
    if (this.draggedTask.status != status) {
      this.updateTaskView(this.draggedTask, status);
      this.taskService.updateTaskDocumentStatus(status, this.draggedTask.taskId, this.projectService.currentId.getValue());
      this.draggedTask = null;
      this.draggedOverSection = null;
    }
  }

  showDropIndication(section) {
    if (this.draggedTask) {
      this.draggedOverSection = section;
    }
  }

  updateTaskView(task: Task, newStatus: string) {
    const taskIndex = this.findIndex(task);
    const previousTaskStatus = task.status

    this.tasksByStatus[previousTaskStatus].splice(taskIndex, 1);

    task.status = newStatus
    this.tasksByStatus[newStatus].push(task);

  }

  findIndex(task: Task) {
    let index: number = -1;
    for (let i = 0; i < this.tasksByStatus[task.status].length; i++) {
      if (task.taskId == this.tasksByStatus[task.status][i].taskId) {
        index = i;
        break;
      }
    }
    return index;
  }
}
