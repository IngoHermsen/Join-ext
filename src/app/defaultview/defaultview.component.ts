import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { TaskService } from 'src/services/task-dialog.service';

@Component({
  selector: 'app-defaultview',
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss']
})
export class DefaultViewComponent {

  constructor(
    public taskService: TaskService,
    public authService: AuthService,
    ) {

  }

  openTaskDialog() {
    this.taskService.showDialog.next(true);
  }


}
