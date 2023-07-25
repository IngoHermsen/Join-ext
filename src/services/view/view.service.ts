import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService implements OnInit {
  showDialog: Subject<boolean> = new Subject;
  dialogContent: string;

  constructor() { }
  
  ngOnInit(): void {
    
  }
}
