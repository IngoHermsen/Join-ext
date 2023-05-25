import { Component, OnInit } from '@angular/core';
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
  projects: any;
  selectedProject: string;
  avatarInitials: string;

  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
    public authService: AuthService,
  ) {
    projectService.currentId.subscribe((value) => {
      this.showActiveProject();
    })

    projectService.projectsAsJson.subscribe((data) => {
      this.projects = data;
      console.log('123', this.projects)
      
    })

    this.authService.userData.subscribe((data) => {
      this.avatarInitials = data.initials;
    })
 
  }

  // example JSON for testing dropdown:
  ngOnInit(): void {
    this.projectService.getProjectsAsJson();
  }


  showActiveProject(activatedBySelection?: boolean) {
    let currentProjectId = this.projectService.currentId;

    if (this.selectedProject !== currentProjectId.getValue()) {
      this.selectedProject = activatedBySelection ? this.selectedProject : currentProjectId.getValue();
      currentProjectId.next(this.selectedProject);
    }
  }

  showProjectDialog() {
    this.projectService.showDialog.next(true);
  }

  showTaskDialog() {
    this.taskService.showDialog.next(true);
  }

}
