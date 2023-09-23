import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task/task.service';
import { take, timestamp } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { ViewService } from 'src/services/view/view.service';
import { ProjectService } from 'src/services/project/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  daytimeGreeting: string;
  greetingName: string;
  deadlineDate: string;
  months: any;
  showDashboard: boolean = false;

  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
    public viewService: ViewService
  ) {
    this.taskService.earliestDueDateSubject.subscribe(timestamp => {
      this.getDeadlineDateString(timestamp);
    })

    console.log(this.projectService.currentId.getValue());
    

    if(this.projectService.currentId.getValue() !== 'none') {      
      console.log(this.projectService.currentId.getValue());
      
      this.showDashboard = true;
      
    }    
  }

  ngOnInit(): void {
    this.greetingName = localStorage.getItem('greetName');
    this.setDisplayMonths();
    this.daytimeGreeting = this.getDaytimeGreeting();
    this.deadlineDate = localStorage.getItem('earliestDueDate')
  }

  ngAfterViewInit(): void {

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


  getDaytimeGreeting() {
    let date = new Date();
    let hours = date.getHours();

    if (hours <= 12) {
      return "Good morning, "
    } else if (hours <= 18) {
      return "Good afternoon, "
    } else {
      return "Good evening, "
    }
  }

  getDeadlineDateString(timestamp: Timestamp) {
    const timestampAsDate = new Date(timestamp.seconds * 1000);
    const day: number = timestampAsDate.getDate();
    const month: string = this.months[timestampAsDate.getMonth()];
    const year: number = timestampAsDate.getFullYear();

    this.deadlineDate = `${month} ${day}, ${year}`;
    localStorage.setItem('earliestDueDate', this.deadlineDate)

  }

}
