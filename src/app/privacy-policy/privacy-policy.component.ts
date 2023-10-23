import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {

  constructor(
    private router: Router
  ) {

  }

  navigateToPreviousRoute() {    
    const prevRoute = sessionStorage.getItem('activeRoute');
    this.router.navigate([prevRoute])
  }
}
