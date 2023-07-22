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

  constructor(
    public projectService: ProjectService
  ) {

  }

  ngOnInit(): void {
    this.transformDueDate();

  }

  btnItems: any[] = [
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
      }
    },
  ]

  transformDueDate() {
    const dueDateAsDate = new Date(this.task.dueDate.seconds * 1000);
    this.dueDateAsDateString = dueDateAsDate.toLocaleDateString();
    console.log(this.dueDateAsDateString);
    


  }

}
