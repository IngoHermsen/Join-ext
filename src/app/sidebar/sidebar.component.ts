import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/services/task/task.service';
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
    public taskService: TaskService,
  ) {
  }

  ngOnInit(): void {
    this.viewService.showDialog.subscribe((value) => {
      this.isVisible = value;
    });
  }

  leaveTaskEditMode() {
    setTimeout(() => {
      this.taskService.activeTask.next(null);
      this.taskService.editMode = false;
    }, 500)
  }
}
