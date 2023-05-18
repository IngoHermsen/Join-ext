import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  currentId = new BehaviorSubject('') ;
  showDialog = new Subject<boolean>;

  constructor() { }
}
