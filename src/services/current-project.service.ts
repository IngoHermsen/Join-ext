import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentProjectService {
  projectId = BehaviorSubject<string>;

  constructor() { }
}
