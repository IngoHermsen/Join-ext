import { Component } from '@angular/core';
import { NewTaskService } from '../new-task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  
  constructor(public newTaskService: NewTaskService) {

  }

  createNewTask() {
    this.newTaskService.showDialog.next(true);
  }

}
