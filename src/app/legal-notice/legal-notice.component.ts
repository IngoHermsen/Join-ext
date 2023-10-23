import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent {

  constructor(
    private router: Router
  ) {

  }

  navigateToPreviousRoute() {    
    const prevRoute = sessionStorage.getItem('activeRoute');
    this.router.navigate([prevRoute])
  }
}
