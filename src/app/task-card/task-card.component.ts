import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/models/task';
import { ProjectService } from 'src/services/project/project.service';
import { TaskService } from 'src/services/task/task.service';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() task: any;
  dueDateAsDateString: string;
  status: string;

  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
    private router: Router,
    private viewService: ViewService
  ) {

  }

  ngOnInit(): void {
    this._transformDueDate();
    this.status = this._setStatus();
  }

  btnItems: any[] = [
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
      }
    },
  ]

  _transformDueDate() {
    const dueDateAsDate = new Date(this.task.dueDate.seconds * 1000);
    this.dueDateAsDateString = dueDateAsDate.toLocaleDateString();
  }

  _setStatus() {
    switch (this.task.status) {
      case 'todo': return 'to-do'; break;
      case 'inProgress': return 'in-progress'; break;
      case 'inReview': return 'in-review'; break;
      default: return 'done'; break
    }

  }

  setTaskEdit(task: Task) {
    this.router.navigate(['/tasks', task['taskId']], { replaceUrl: true });
    this.viewService.showSidebar('task')
    this.taskService.editMode = true;
    this.taskService.activeTask = task;
  }
}
