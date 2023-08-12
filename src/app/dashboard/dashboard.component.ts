import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task/task.service';
import { take } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  deadlineDate: string;
  months;

  constructor(
    public taskService: TaskService,
  ) {
    this.taskService.earliestDueDate.subscribe(timestamp => {     
      const timestampAsDate = new Date(timestamp.seconds * 1000);      
      const day: number = timestampAsDate.getDate();            
      const year: number = timestampAsDate.getFullYear();
      const month: string = this.months[timestampAsDate.getMonth()];
      
      this.deadlineDate = `${month} ${day}, ${year}`;

    })
  }

  ngOnInit(): void {
    this.setDisplayMonths();
  }

  setDisplayMonths() {
    this.months = {
      0: 'January', 
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December',
    }

  }

}
