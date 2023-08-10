import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task/task.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  numberOfTasks: number;

  constructor(
    public taskService: TaskService,
  ) {
    
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

}
