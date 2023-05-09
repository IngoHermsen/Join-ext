import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewTaskService {
  showDialog = new Subject<boolean>;

  constructor() {

  }
}
