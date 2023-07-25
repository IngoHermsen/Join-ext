import { Component, OnInit } from '@angular/core';
import { ViewService } from 'src/services/view/view.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  isVisible: boolean;
  

  constructor(
    public viewService: ViewService,
  ) {
    
  }
  
  ngOnInit(): void {
    this.viewService.showDialog.subscribe((value) => {
      this.isVisible = value;
    })
  }
}
