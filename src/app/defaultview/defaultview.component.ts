import { Component, EventEmitter, OnInit } from '@angular/core';
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
  selectedProject: string;

  projectNr = 0;

  constructor(
    public currentProjectService: CurrentProjectService,
    public taskService: TaskService,
    public authService: AuthService,
  ) {
    currentProjectService.projectId.subscribe((value) => {
      
    })


  }

  checkActiveProject() {
    let currentProjectIdFromService = this.currentProjectService.projectId;

    if(this.selectedProject !== currentProjectIdFromService.getValue()) {
      currentProjectIdFromService.next(this.selectedProject);
      
    }
    
  }
  

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
