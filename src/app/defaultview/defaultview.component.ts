import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { concatMap, from, map, mergeMap } from 'rxjs';
import { Project } from 'src/models/project';
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
  @Input() showNav: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewService.setNavViewMode()
  }
  viewInitialized: boolean = false;
  userId: string;
  show: boolean;
  projects: any;
  projectItems: any;
  projectTitle: string;
  avatarInitials: string;
  showAvatarMenu: boolean = false;
  showProjectDropdown: boolean = false;
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
  ngAfterViewInit() {
    this.contactService.getContactList()
  }

  ngOnInit(): void {
    this.initializeView(this._getUserData());
    let date = new Date();

  }

  ngOnDestroy(): void {
    // this.userSubscription.unsubscribe();
  }

  setProjectDropdownItems() {
    let items = [];
    this.projects.forEach(project => {
      items.push({
        label: project.projectTitle,
        id: project.projectId,
      })
    })

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

  hideNav(value) {
    this.showNav = false;
  }

  toggleAvatarMenu() {
    this.showAvatarMenu = !this.showAvatarMenu
  }

  toggleDropdown() {
    this.showProjectDropdown = !this.showProjectDropdown;
  }
}


