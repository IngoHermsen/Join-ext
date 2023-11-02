import { Component, HostListener, Input, OnDestroy } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { NavigationEnd, Router } from '@angular/router';
import { tap } from 'rxjs';
import { Contact } from 'src/models/contact';
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
  providers: [ProjectService]
})
export class DefaultViewComponent {
  @Input() showNav: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewService.setView()
  }
  userId: string;
  show: boolean;
  projects: any;
  projectItems: any;
  projectId: string = null;

  avatarInitials: string;
  showAvatarMenu: boolean = true;
  showProjectDropdown: boolean = false;
  currentRoute: string;
  routeIsContacts: boolean = null;
  guestSession: boolean = false;
  publicProfile: boolean;

  // subscriptions
  projectSubscription: any;
  taskSubscription: any;
  userDataSubscription: any;
  routeSubscription: any;

  projectLoadedSubscription: any;
  tasksLoadedSubscription: any;

  // Firebase Environemt
  fbCollectionForContacts: AngularFirestoreCollection = null;


  constructor(
    public projectService: ProjectService,
    public contactService: ContactService,
    public taskService: TaskService,
    public viewService: ViewService,
    public authService: AuthService,
    public router: Router,

  ) {

    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });

    this.projectService.projectsAsJson.subscribe((data) => {
      this.projects = data;
    });

    this._setActiveUserAsAssignable()

    this.initializeView(this._getUserData())


    this.projectSubscription = this.projectService.currentId.subscribe((value) => {
      if (value != "") {
        this.projectService.setActiveProject(value);
      } else {       
        this.projectService.projectTitle = 'NO ACTIVE PROJECT';
        this.viewService.dashboardLoaded = true;
        this.projectService.projectLoaded = true;
      }
    });

    this.taskSubscription = this.taskService.newTask.subscribe((data) => {
      this.projectService.saveNewTask(data);
    });

  }

  _getUserData() {
    if (localStorage.getItem('user') !== 'null' && !this.authService.loggedIn) {
      const isGuestSession: boolean = JSON.parse(localStorage.getItem('guestSession'))
      this._setGuestSessionStatus(isGuestSession)
      return this._getUserDataFromLocalStorage()
    } else {
      this._setGuestSessionStatus(this.authService.guestLogin);
      return this._getUserDataFromAuth()
    }
  }

  initializeView(user: User) {   
    if (!this.viewService.viewInitialized) {
      this.userId = user.uid;
      this.avatarInitials = user.initials;
      this.projectService.getProjectsAsJson(user.uid);
      this.projectService.currentId.next(user.latestActiveProject);
      this.publicProfile = user.public;
      this.viewService.viewInitialized = true;
    }
  }


  ngAfterViewInit() {    
    this.contactService.getContactList();
  }


  _setGuestSessionStatus(status: boolean) {
    this.guestSession = status;
    this.taskService.isGuestSession = status;
    this.projectService.isGuestSession = status;
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

  _setActiveUserAsAssignable() {
    this.contactService.activeUsersDoc.get().pipe(tap(user => {
      const userData = user.data()
      const asContact: Contact = new Contact(
        {
          uid: userData['uid'],
          firstName: userData['firstName'],
          lastName: userData['lastName'],
          initials: userData['initials'],
          email: userData['email'],
          displayName: userData['firstName'] + " " + userData['lastName']
        }
      )

      this.contactService.activeUserAsAssignable = asContact;
    })).subscribe()
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
    this.guestSession = this.authService.guestLogin;
    return this.authService.userData;
  }

  showProjectDialog() {
    this.projectService.showDialog.next(true);
  }

  hideNav(value) {
    this.showNav = false;
  }

  toggleAvatarMenu() {
    this.showAvatarMenu = !this.showAvatarMenu;
  }

  toggleDropdown() {
    this.showProjectDropdown = !this.showProjectDropdown;
  }

  changeProfileState() {
    this.contactService.setProfileState(this.publicProfile);
  }


}


