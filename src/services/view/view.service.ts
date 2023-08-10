import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService implements OnInit {
  showSignUpNote: boolean = false;
  showDialog: Subject<boolean> = new Subject;
  dialogContent: string;

  constructor() { }
  
  ngOnInit(): void {
    
  }

  showSidebar(contentType: string) {
    this.dialogContent = contentType;
    this.showDialog.next(true);
    
  }

}
