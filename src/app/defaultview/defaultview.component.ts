import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Project } from 'src/models/project';
import { AuthService } from 'src/services/auth/auth.service';
import { CurrentProjectService } from 'src/services/current-project.service';
import { TaskService } from 'src/services/task-dialog/task-dialog.service';


@Component({
  selector: 'app-defaultview',
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss']
})
export class DefaultViewComponent implements OnInit {
  projects: Project[];
  currentProjectId: Subject<String>;

  constructor(
    public currentProjectService: CurrentProjectService,
    public taskService: TaskService,
    public authService: AuthService,
  ) {}

  

  loadProjectData(projectId) {

  }

  

  // example JSON for testing dropdown:
  ngOnInit(): void {
    this.projects = [
      {
        projectId: '234567',
        projectName: 'irgendein Projekt',
        tasks: [],
        projectOwnerId: '222222'
      },
      {
        projectId: '123456',
        projectName: 'noch ein Projekt',
        tasks: [],
        projectOwnerId: '333333'
      },
      {
        projectId: '345678',
        projectName: 'und noch eins',
        tasks: [],
        projectOwnerId: '444444'
      }

    ]
  }



  openTaskDialog() {
    this.taskService.showDialog.next(true);
  }


}
