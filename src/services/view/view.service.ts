import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService implements OnInit {
  fixedNav: boolean;
  showSignUpNote: boolean = false;
  showResetPasswordNote: boolean = false;
  showDialog: Subject<boolean> = new Subject;
  dialogContent: string;
  viewInitialized: boolean = false;
  boundaryClass: string = '';
  windowWidth: number;

  // addButtonContext
  contextContent: string;
  buttonLabel: string;
  targetDialog: string;
  transparent: boolean = false;


  showLegalLinksInNav: boolean;
  showSmallLegalLinks: boolean = false;

  // loaded data state:
  dashboardLoaded: boolean = false;

  constructor(
    private router: Router,
  ) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.setAddButtonContext(e.url)
        
      };
      
    })
  }

  ngOnInit(): void {

  }

  setView() {
    this.windowWidth = window.innerWidth;
    this.setNavViewMode();
    this.setBoundaryClass();
  }

  setNavViewMode() {
    const minViewWidth: number = 520;
    const maxViewWidth: number = 1450;
    const windowWidth = this.windowWidth;
    this.fixedNav = windowWidth < minViewWidth || windowWidth > maxViewWidth;
    this.setLegalLinksInNav();
  }

  setBoundaryClass() {
    const windowWidth = this.windowWidth;

    if (windowWidth <= 620) {
      this.boundaryClass = ''
    } else {
      this.boundaryClass = 'boundary';
    }
  }

  showSidebar(contentType: string) {
    this.dialogContent = contentType;
    this.showDialog.next(true);
  }

  setLegalLinksInNav() {
    this.showLegalLinksInNav = this.windowWidth > 520;

  }

  setAddButtonContext(url) {
    this.buttonLabel = url == '/contacts' ? 'Add contacts' : 'Add task';
    this.targetDialog = url == '/contacts' ? 'contacts' : 'task';
    
  }



}
