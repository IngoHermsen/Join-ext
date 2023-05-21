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
  avatarInitials: string;

  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
    public authService: AuthService,
  ) {
    projectService.currentId.subscribe((value) => {
      this.showActiveProject();
    })
    this.authService.userData.subscribe((data) => {
      this.avatarInitials = data.initials;
    })

    this.projects = []
    
  }

  // example JSON for testing dropdown:
  ngOnInit(): void {
    this.projects =  [{
      projectDescription: "project beschreibung",
      projectId: 'dhfw0fhw0fwfwfw',
      projectOwnerId: 'q200e9ewfw0fwd0fw0wf',
      projectTitle: 'Projekt Nr. 1',
      tasks: []
   
  }]
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
