import { AfterViewInit, Injectable, OnInit } from '@angular/core';
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
    const minViewWidth: number = 520;
    const maxViewWidth: number = 1450
    const windowWidth = window.innerWidth;

    this.fixedNav = windowWidth < minViewWidth || windowWidth > maxViewWidth;
  }

  showSidebar(contentType: string) {
    this.dialogContent = contentType;
    this.showDialog.next(true);
  }

}
