import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {

  constructor(
    private router: Router,
    private viewService: ViewService,
  ) {
        
  }

  navigateToPreviousRoute() {    
    const prevRoute = sessionStorage.getItem('activeRoute');
    this.router.navigate([prevRoute]);
    this.viewService.showSmallLegalLinks = false;    
  }
}
