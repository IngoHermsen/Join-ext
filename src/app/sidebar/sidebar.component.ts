import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskService } from 'src/services/task/task.service';
import { ViewService } from 'src/services/view/view.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, OnDestroy {
  isVisible: boolean;

  // Subscriptions:
  showDialog: Subscription;


  constructor(
    public viewService: ViewService,
    public taskService: TaskService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.showDialog = this.viewService.showDialog.subscribe((value) => {      
      this.isVisible = value;
    });
  }

  ngOnDestroy(): void {
    this.showDialog.unsubscribe();
  }

  leaveTaskEditMode() {
        setTimeout(() => {
      this.taskService.activeTask.next(null);
      this.taskService.editMode = false;
    }, 500)
  }
}
