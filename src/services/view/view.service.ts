import { Injectable, OnInit } from '@angular/core';
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

  newProjectBtnLabel: string;

  // loaded data state:
  dashboardLoaded: boolean = false;

  constructor() { 
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
    const maxViewWidth: number = 1450
    const windowWidth = this.windowWidth;

    this.fixedNav = windowWidth < minViewWidth || windowWidth > maxViewWidth;
  }

  setBoundaryClass() {
    const windowWidth = this.windowWidth;
    
    if(windowWidth <= 620) {
      this.boundaryClass = ''
    } else {      
      this.boundaryClass = 'boundary';
    }
  }

  showSidebar(contentType: string) {
    this.dialogContent = contentType;
    this.showDialog.next(true);
  }


}
