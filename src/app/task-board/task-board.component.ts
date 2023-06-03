import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/services/project/project.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {

  constructor(
        public projectService: ProjectService
  ) {
    this.projectService.currentId
  }

  ngOnInit(): void {
    
  }
}
