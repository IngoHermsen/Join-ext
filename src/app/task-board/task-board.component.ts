import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
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
  draggedHTMLElement: HTMLElement = null;
  draggedOverSection: string = null;
  editedTask: Task = null;
  hideAllTasks: boolean = false;
  hideSection: string = null;
  sectionView: any = {}


  //subscriptions
  projectSubscription: any;

  fbProjectRefCollectionName: string;


  constructor(
    public projectService: ProjectService,
    public taskService: TaskService
  ) {

    if (this.taskService.isGuestSession) {
      this.fbProjectRefCollectionName = 'guest_projects';
    } else {
      this.fbProjectRefCollectionName = 'projects';
    }

    this.taskService.fbProjectsCollectionName = this.fbProjectRefCollectionName

    addEventListener('drag', e => {
      this.draggedHTMLElement = e.target as HTMLElement;
      this.draggedHTMLElement.classList.add('dragging');
      this._setTaskView(window.innerWidth);
    });

    addEventListener('dragend', e => {
      this.draggedHTMLElement.classList.remove('dragging');
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

    this.taskService.activeTask.subscribe(task => {
      if (task) {
        this.editedTask = task;
      }
    });

    this.projectService.taskUpdates.subscribe((taskEntries) => {
      this.editedTask.title = taskEntries.title,
        this.editedTask.description = taskEntries.description,
        this.editedTask.assignedUsers = taskEntries.assignedUsers,
        this.editedTask.dueDate = taskEntries.dueDate,
        this.editedTask.priority = taskEntries.priority

      this._updateTaskView(this.editedTask)
    });

    this.projectService.deletedTaskId.subscribe((task) => {
      const taskStatusArray: Array<any> = this.taskService.tasksByStatus[task.status]
    
      const taskIndex: number = taskStatusArray.findIndex(statusTask => {        
        return statusTask.taskId == task.taskId;              
      });
      console.log(taskStatusArray);
      console.log(taskIndex)
      

      taskStatusArray.splice(taskIndex, 1)
    })

  }

  dragStart(task: Task) {
    this.draggedTask = task;
  }

  drop(status: string) {
    if (this.draggedTask.status != status) {
      this._updateTaskView(this.draggedTask, status);
      this.taskService.updateTaskDocumentStatus(status, this.draggedTask.taskId, this.projectService.currentId.getValue());
    }

    this.draggedTask = null;
    this.draggedOverSection = null;
    this.hideAllTasks = false;

  }

  showDropIndication(section) {    
    if (this.draggedTask && this.draggedTask.status !== section) {
      this.draggedOverSection = section;
    } 
  }

  _updateTaskView(task: Task, newStatus?: string) {
    const previousTaskStatus = task.status;
    const statusArray = this.taskService.tasksByStatus[previousTaskStatus]
    const index = this._findIndex(task);

    this.taskService.tasksByStatus[previousTaskStatus].splice(index, 1);

    if (newStatus) {

      task.status = newStatus
      this.taskService.tasksByStatus[newStatus].push(task);
    } else {
      statusArray.splice(index, 0, task);
      this._convertDueDate(statusArray, this._findIndex(task))
    }

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
    }
  }
}
