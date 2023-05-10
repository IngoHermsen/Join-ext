import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  showDialog = new Subject<boolean>;

  constructor() {

  }
}
