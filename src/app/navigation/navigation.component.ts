import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<boolean>;

  
  constructor(
    public viewService: ViewService
  ) {

  }
  
  ngOnInit(): void {
    
  }

  closeNav() {   
    this.closeEvent.emit(true)
  }

}
