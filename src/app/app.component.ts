import { Component, OnInit } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    //TODO: do not redirect on login page on refresh if user is already logged in 
    this.router.navigate([''])
  }

  title = 'ng-join';
  currentRoute: string;

}




