import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth/auth.service';
import { ViewService } from 'src/services/view/view.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
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
    this.viewService.setView();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe()    
  } 

  _setInitialRoute() {    
    if (!this.sessionHasExpired()) { 
      this.activeRoute = sessionStorage.getItem('activeRoute') || 'summary';
      this.router.navigate([this.activeRoute]);
    } else {
      this.authService.SignOut(); 
    }

    this._setRouterSubscription()
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

  _setActivityTime() {
    const time = new Date()
    localStorage.setItem('activeTime', time.toString());
  }

  _setRouterSubscription() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._setSessionStorageRouteItem(event.url)
        this._setActivityTime();
      }
    })
  }

  _setSessionStorageRouteItem(url: string) {
    
    if(!url.includes('privacy-policy') && !url.includes('legal-notice')) {
      sessionStorage.setItem('activeRoute', url);
    }
  }
  
}




