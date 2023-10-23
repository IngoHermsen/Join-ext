import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent {

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
