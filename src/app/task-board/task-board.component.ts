import { Component, OnDestroy, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import {
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Task } from 'src/models/task';
import { ProjectService } from 'src/services/project/project.service';
import { TaskService } from 'src/services/task/task.service';
import { ViewService } from 'src/services/view/view.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],

})
export class TaskBoardComponent implements OnInit, OnDestroy {
  draggedTask: Task = null;
  draggedHTMLElement: HTMLElement = null;
  draggedOverSection: string = null;
  editedTask: Task = null;
  hideAllTasks: boolean = false;
  hideSection: string = null;
  sectionView: any = {};
  boundaryClass: string = '';
  lockYAxis: boolean = false;


  fbProjectRefCollectionName: string;

  //subscriptions
  taskUpdates: Subscription;
  activeTask: Subscription;
  deletedTask: Subscription;


  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
    public viewService: ViewService,
  ) {

    if (this.taskService.isGuestSession) {
      this.fbProjectRefCollectionName = 'guest_projects';
    } else {
      this.fbProjectRefCollectionName = 'projects';
    }

    this.taskService.fbProjectsCollectionName = this.fbProjectRefCollectionName


    addEventListener('drag', e => {
      this.draggedHTMLElement = e.target as HTMLElement;
      this._setTaskView(window.innerWidth);
    });

    addEventListener('dragend', e => {
      this.draggedHTMLElement.classList.remove('selected');
      this.draggedHTMLElement = null;
      this.draggedTask = null;
      this.draggedOverSection = null;
      this.hideAllTasks = false;
    })

  }

  ngOnInit(): void {

    this.sectionView = {
      todo: true,
      inProgress: true,
      inReview: true,
      done: true
    };

    this.activeTask = this.taskService.activeTask.subscribe(task => {
      if (task) {
        this.editedTask = task;
      }
    });



    this.taskUpdates = this.projectService.taskUpdates.subscribe((taskEntries) => {
      this.editedTask.title = taskEntries.title,
        this.editedTask.description = taskEntries.description,
        this.editedTask.assignedUsers = taskEntries.assignedUsers,
        this.editedTask.dueDate = taskEntries.dueDate,
        this.editedTask.priority = taskEntries.priority

      this._updateTaskView(this.editedTask)
    });

   this.deletedTask = this.projectService.deletedTaskId.subscribe((task) => {
      const taskStatusArray: Array<any> = this.taskService.tasksByStatus[task.status]

      const taskIndex: number = taskStatusArray.findIndex(statusTask => {
        return statusTask.taskId == task.taskId;
      });

      taskStatusArray.splice(taskIndex, 1)
    })

  }

  ngOnDestroy(): void {
    this.taskUpdates.unsubscribe();
    this.activeTask.unsubscribe();
    this.deletedTask.unsubscribe()
  }

  dragStart(task: Task) {    
    this.hideAllTasks = window.innerWidth <= 620;
    this.draggedTask = task;
  }

  drop(event: CdkDragDrop<string[]>) {
    const newStatus = event.container.id;    
    const newStatusArray = this.taskService.tasksByStatus[newStatus];
    const newIndex = event.currentIndex;    
    let droppedTask;    
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      droppedTask = newStatusArray[newIndex];  
      droppedTask.status = newStatus;      
      this.taskService.updateTaskDocumentStatus(newStatus, droppedTask.taskId, this.projectService.currentId.getValue());
    }
    this.hideAllTasks = false;

  }

  showDropIndication(section) {
    if (this.draggedTask && this.draggedTask.status !== section) {
      this.draggedOverSection = section;
    }
  }

  _updateTaskView(task: Task) {
    const statusArray = this.taskService.tasksByStatus[task.status]
    this._convertDueDate(statusArray, this._findIndex(task))
    this.editedTask = null;
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

  _convertDueDate(statusArray: Array<any>, index: number) {
    let taskDueDate = statusArray[index].dueDate;
    statusArray[index].dueDate = Timestamp.fromDate(taskDueDate)
  }


  _setTaskView(screenWidth: number) {
    if (screenWidth <= 620) {
      this.hideAllTasks = true;
      this.boundaryClass = '';
    } else {
      this.boundaryClass = 'boundary'
    }
  }


}
