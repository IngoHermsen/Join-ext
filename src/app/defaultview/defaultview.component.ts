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
  avatarInitials: string;
  
  // subscriptions
  taskSubscription: any;
  userSubscription: any;


  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
    public authService: AuthService,
  ) {

  }

  ngOnInit(): void {


    this.projectService.projectsAsJson.subscribe((data) => {
      this.projects = data;
    })

    this.userSubscription = this.authService.userData.subscribe((data) => {
      this.userId = data.uid;
      this.avatarInitials = data.initials;
      this.projectService.getProjectsAsJson(this.userId);
      this.projectService.currentId = data.latestActiveProject;
    })

    this.taskSubscription = this.taskService.newTask.subscribe((data) => {
      console.log('task data', data);
      
      this.projectService.saveNewTask(data)
    })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  showProjectDialog() {
    this.projectService.showDialog.next(true);
  }

  showTaskDialog() {
    this.taskService.showDialog.next(true);
  }

}
