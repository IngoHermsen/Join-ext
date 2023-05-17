import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentProjectService {
  projectId = new BehaviorSubject('');

  constructor() {
  }
}
