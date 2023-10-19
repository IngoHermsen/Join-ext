import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjectService } from 'src/services/project/project.service';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<boolean>;

  
  constructor(
    public viewService: ViewService,
    public projectService: ProjectService
  ) {

  }
  
  ngOnInit(): void {
    
  }

  closeNav() {  
    if (!this.viewService.fixedNav) {
      this.closeEvent.emit(true)
    }
  }

}
