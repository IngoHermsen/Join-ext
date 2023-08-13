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

  ngOnInit(): void {}
  

  dragStart(task: Task) {
    this.draggedTask = task;

  }

  drop(status: string) {
    if (this.draggedTask.status != status) {
      this._updateTaskView(this.draggedTask, status);
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

  _updateTaskView(task: Task, newStatus: string) {
    const taskIndex = this._findIndex(task);
    const previousTaskStatus = task.status

    this.taskService.tasksByStatus[previousTaskStatus].splice(taskIndex, 1);

    task.status = newStatus
    this.taskService.tasksByStatus[newStatus].push(task);

  }

  _findIndex(task: Task) {
    let index: number = -1;
    for (let i = 0; i < this.taskService.tasksByStatus[task.status].length; i++) {
      if (task.taskId == this.taskService.tasksByStatus[task.status][i].taskId) {
        index = i;
        break;
      }
    }
    return index;
  }
}
