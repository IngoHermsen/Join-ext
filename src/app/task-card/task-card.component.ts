import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from 'src/services/project/project.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() task: any;

  constructor(

      public projectService: ProjectService
  ) {

  }

  ngOnInit(): void {
    console.log(this.task.description)
  }

  btnItems: any[] = [
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        // this.delete();
      }
    },

  ]

}
