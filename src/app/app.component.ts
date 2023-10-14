import { Component, OnInit } from '@angular/core';
import { ViewService } from 'src/services/view/view.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'ng-join';
  
  constructor(
    public viewService: ViewService,

    ) {}

  ngOnInit() {    

    this.viewService.setNavViewMode();    
  }
}




