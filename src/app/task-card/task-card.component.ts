import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from 'src/services/project/project.service';

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
    public projectService: ProjectService
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
      switch(this.task.status) {
        case 'todo': return 'to-do'; break;
        case 'inProgress': return 'in-progress'; break;
        case 'inReview': return 'in-review'; break;
        default: return 'done'; break
      }
    
  }

}
