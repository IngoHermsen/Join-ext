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
  @Input() task: Task;
  dueDateAsString: string;
  status: string;

  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
    private router: Router,
    private viewService: ViewService
  ) {

  }

  ngOnInit(): void {
    this.dueDateAsString = this.taskService.transformDueDate(this.task.dueDate);
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

  _setStatus() {
    switch (this.task.status) {
      case 'todo': return 'to-do'; break;
      case 'inProgress': return 'in-progress'; break;
      case 'inReview': return 'in-review'; break;
      default: return 'done'; break
    }

  }

  openTaskEdit(task: Task) {
    this.router.navigate(['/tasks', task['taskId']], { replaceUrl: true });
    this.viewService.showSidebar('task');
    this.taskService.editMode = true
    this.taskService.activeTask.next(task);
  }

}
