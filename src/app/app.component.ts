import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ViewService } from 'src/services/view/view.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'ng-join';
  activeRoute: string;

  
  constructor(
    private router: Router,
    public viewService: ViewService,

    ) {
      this.router.events.subscribe((event) => {        
        if(event instanceof NavigationEnd) {          
          sessionStorage.setItem('activeRoute', event.url)
        }
      })
    }

  ngOnInit() {    
    this.viewService.setNavViewMode(); 
    this.activeRoute = sessionStorage.getItem('activeRoute') || 'auth/login'
    
    this.router.navigate([this.activeRoute])
  }
}




