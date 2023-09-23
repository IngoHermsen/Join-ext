import { Component, OnInit } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { TaskService } from 'src/services/task/task.service';
import { ViewService } from 'src/services/view/view.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'ng-join';
  
  constructor(
    private router: Router,
    public viewService: ViewService,
    public taskService: TaskService,

    ) {}

  ngOnInit() {    
    if(localStorage.getItem('user') !== 'null') {
      // this.router.navigate(['summary'])            
    }

    this.viewService.setNavViewMode();    
  }
}




