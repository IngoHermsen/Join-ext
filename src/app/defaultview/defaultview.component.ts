import { Component, OnInit } from '@angular/core';
import { Project } from 'src/models/project';
import { AuthService } from 'src/services/auth/auth.service';
import { ProjectService } from 'src/services/project/project.service';
import { TaskService } from 'src/services/task/task.service';


@Component({
  selector: 'app-defaultview',
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss']
})
export class DefaultViewComponent implements OnInit {
  show: boolean;
  projects: Project[];
  selectedProject: string;

  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
    public authService: AuthService,
  ) {
    projectService.currentId.subscribe((value) => {

    })
  }

  checkActiveProject() {
    let currentProjectIdFromService = this.projectService.currentId

    if (this.selectedProject !== currentProjectIdFromService.getValue()) {
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
        projectTitle: 'irgendein Projekt',
        projectDescription: '',
        tasks: [],
        projectOwnerId: '222222'
      },
      {
        projectId: '123456',
        projectTitle: 'noch ein Projekt',
        projectDescription: '',
        tasks: [],
        projectOwnerId: '333333'
      },
      {
        projectId: '345678',
        projectTitle: 'und noch eins',
        projectDescription: '',
        tasks: [],
        projectOwnerId: '444444'
      }

    ]
  }

  showProjectDialog() {
    this.projectService.showDialog.next(true);

  }

  showTaskDialog() {
    this.taskService.showDialog.next(true);
  }


}
