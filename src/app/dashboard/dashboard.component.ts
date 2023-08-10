import { Component } from '@angular/core';
import { TaskService } from '../../services/task/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  numberOfTasks: number;

  constructor(
    public taskService: TaskService,
  ) {

    console.log(this.taskService.tasksByStatus);

  }

}
