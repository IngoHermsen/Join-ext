import { Component, OnInit } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  userIsLoggedIn: boolean = null;
  title = 'ng-join';
  
  constructor(private router: Router) {}

  ngOnInit() {
    if(localStorage.getItem('user') !== 'null') {
      this.router.navigate(['summary'])            
    }
  }

}




