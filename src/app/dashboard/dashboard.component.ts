import { Component } from '@angular/core';
import { TaskService } from '../../services/task-dialog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  
  constructor(public newTaskService: TaskService) {

  }

}
