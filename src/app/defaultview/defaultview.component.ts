import { getLocaleCurrencyCode } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/auth/auth.service';
import { ContactService } from 'src/services/contact/contact.service';
import { ProjectService } from 'src/services/project/project.service';
import { TaskService } from 'src/services/task/task.service';
import { ViewService } from 'src/services/view/view.service';


@Component({
  selector: 'app-defaultview',
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss']
  
})
export class DefaultViewComponent implements OnInit, OnDestroy {
  viewInitialized: boolean = false;
  userId: string;
  show: boolean;
  projects: any;
  activeProject: string;
  avatarInitials: string;
  currentRoute: string;
  routeIsContacts: boolean = null;

  // subscriptions
  taskSubscription: any;
  userSubscription: any;
  routeSubscription: any;

  constructor(
    public projectService: ProjectService,
    public contactService: ContactService,
    public taskService: TaskService,
    public viewService: ViewService,
    public authService: AuthService,
    public router: Router
  ) {
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    })

    this.projectService.projectsAsJson.subscribe((data) => {
      this.projects = data;
    })

    if (localStorage.getItem('user') !== 'null' && !authService.loggedIn) {

      let pseudoUser: User = new User()
      const userAsJson: any = JSON.parse(localStorage.getItem('user'));
      const userInitials: string = localStorage.getItem('initials');
      const activeProject: string = localStorage.getItem('activeProject');

      pseudoUser.uid = userAsJson.uid;
      pseudoUser.initials = userInitials;
      pseudoUser.latestActiveProject = activeProject;

      this.initializeView(pseudoUser)
    }

    this.userSubscription = this.authService.userData.subscribe((user) => {
      this.initializeView(user)
    })

    this.taskSubscription = this.taskService.newTask.subscribe((data) => {            
      this.projectService.saveNewTask(data);
      
    })
  }

  initializeView(user: User) {
    if (!this.viewInitialized) {
      this.userId = user.uid;
      this.avatarInitials = user.initials;
      this.projectService.getProjectsAsJson(user.uid);
      this.projectService.currentId.next(user.latestActiveProject);
      this.viewInitialized = true;
    }
  }

  changeActiveProject(projectId?: string) {
    let id = projectId || this.activeProject;
    this.projectService.currentId.next(id);

    // die neue ID muss noch als "latestActiveProject" beim User eingetragen werden in firebase

    localStorage.setItem('activeProject', id);
  }

  ngOnInit(): void {
    this.contactService.getContactList();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  showProjectDialog() {
    this.projectService.showDialog.next(true);
  }

  }


