import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';
import { ProjectService } from 'src/services/project/project.service';
import { TaskService } from 'src/services/task/task.service';


@Component({
  selector: 'app-defaultview',
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss']
})
export class DefaultViewComponent implements OnInit, OnDestroy {
  userId: string;
  show: boolean;
  projects: any;
  selectedProject: string;
  avatarInitials: string;
  userSubscription: any;

  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
    public authService: AuthService,
  ) {
   
  }

  ngOnInit(): void {
    this.projectService.currentId.subscribe((value) => {
      this.showActiveProject();
    })

    this.projectService.projectsAsJson.subscribe((data) => {
      this.projects = data;
    })

    this.userSubscription = this.authService.userData.subscribe((data) => {
      this.userId = data.uid;
      this.avatarInitials = data.initials;
      this.projectService.getProjectsAsJson(this.userId);
      console.log('projects', this.projects);
      // this.authService.userData.unsubscribe();
    })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
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
