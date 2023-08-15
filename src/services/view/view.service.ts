import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService implements OnInit {
  fixedNav: boolean;
  showSignUpNote: boolean = false;
  showDialog: Subject<boolean> = new Subject;
  dialogContent: string;

  constructor() { }
  
  ngOnInit(): void {
    
  }

  setNavViewMode() {
    const windowWidth = window.innerWidth;
      this.fixedNav = windowWidth > 1450 ? true : false;
    }

  showSidebar(contentType: string) {
    this.dialogContent = contentType;
    this.showDialog.next(true);
  }

}
