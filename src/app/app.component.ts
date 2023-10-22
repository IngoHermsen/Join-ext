import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth/auth.service';
import { ViewService } from 'src/services/view/view.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'ng-join';
  activeRoute: string;

  // router Subscription
  routerSubscription: Subscription = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    public viewService: ViewService,

  ) {

  }

  ngOnInit() {
    this._setInitialRoute();
    this.viewService.setNavViewMode();
  }

  _setInitialRoute() {    
    if (!this.sessionHasExpired()) { 
      this.activeRoute = sessionStorage.getItem('activeRoute') || 'summary';
      this.router.navigate([this.activeRoute]);
    } else {
      this.authService.SignOut(); 
    }

    this.setRouterSubscription()
  }

  sessionHasExpired() {
    const allowedDuration = 15;
    const latestActiveTime = localStorage.getItem('activeTime');

    if (latestActiveTime) {
      let activeTimeAsDate = new Date(latestActiveTime);
      let timestamp = activeTimeAsDate.getTime();

      const actualTime = new Date();
      const actualTimeAsTimestamp = actualTime.getTime();

      const timeDifference = actualTimeAsTimestamp - timestamp;
      const differenceInSeconds = timeDifference / 1000;
      const differenceInMinutes = differenceInSeconds / 60;
      
      return differenceInMinutes > allowedDuration;

    } else {
      return true;
    }
  }

  setActivityTime() {
    const time = new Date()
    localStorage.setItem('activeTime', time.toString());
  }

  setRouterSubscription() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        sessionStorage.setItem('activeRoute', event.url);
        this.setActivityTime()
      }
    })
  }

}




