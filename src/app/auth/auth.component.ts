import { Component } from '@angular/core';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  animateJoinLogo: boolean;
    
  constructor(
    public viewService: ViewService,
  ) {
    this.animateJoinLogo = window.innerWidth > 500;
  }
}
