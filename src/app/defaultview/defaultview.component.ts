import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/auth/auth.service';
import { ContactService } from 'src/services/contact/contact.service';
import { ProjectService } from 'src/services/project/project.service';
import { TaskService } from 'src/services/task/task.service';
import { ViewService } from 'src/services/view/view.service';


@Component({
  selector: 'app-defaultview',
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss'],

})
export class DefaultViewComponent implements OnInit, OnDestroy {
  viewInitialized: boolean = false;
  userId: string;
  show: boolean;
  projects: any;
  activeProject: string;
  projectTitle: string;
  avatarInitials: string;
  currentRoute: string;
  routeIsContacts: boolean = null;

  // subscriptions
  projectSubscription: any;
  taskSubscription: any;
  userDataSubscription: any;
  routeSubscription: any;

  // usersFirebaseDoc


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
    });

    this.projectService.projectsAsJson.subscribe((data) => {      
      this.projects = data;
    });

    this.initializeView(this._getUserData())


    this.projectSubscription = this.projectService.currentId.subscribe((value) => {
      this.projectService.setActiveProject(value);
      
    });

    this.taskSubscription = this.taskService.newTask.subscribe((data) => {
      this.projectService.saveNewTask(data);

    })
  }

  _getUserData() {
    if (localStorage.getItem('user') !== 'null' && !this.authService.loggedIn) {
      return this._getUserDataFromLocalStorage()
    } else {      
      return this._getUserDataFromAuth()
    }
  }

  initializeView(user: User) {        
    if (!this.viewInitialized) {
      this.userId = user.uid;
      this.avatarInitials = user.initials;
      this.projectService.getProjectsAsJson(user.uid);      
      this.projectService.currentId.next(user.latestActiveProject)

      this.viewInitialized = true;
    }
  }

  changeActiveProject(projectId?: string) {
    let id = projectId || this.activeProject;
    this.projectService.currentId.next(id);
    this.projectService.setLatestProjectInUserDoc(id)

    localStorage.setItem('activeProject', id);
  }

  ngAfterViewInit() {
   
  }

  ngOnInit(): void {
    this.contactService.getContactList();
    this.initializeView(this._getUserData());
    let date = new Date();
    console.log(Date.parse(date.toDateString()));
    
        
  }

  ngOnDestroy(): void {
    // this.userSubscription.unsubscribe();
  }

  _getUserDataFromLocalStorage() {
    let pseudoUser: User = new User()
    const userAsJson: any = JSON.parse(localStorage.getItem('user'));
    const userInitials: string = localStorage.getItem('initials');
    const latestProject: string = localStorage.getItem('activeProject');

    pseudoUser.uid = userAsJson.uid;
    pseudoUser.initials = userInitials;
    pseudoUser.latestActiveProject = latestProject;

    return pseudoUser
  }

  _getUserDataFromAuth() {    
    return this.authService.userData;
  }

  showProjectDialog() {
    this.projectService.showDialog.next(true);
  }
}


