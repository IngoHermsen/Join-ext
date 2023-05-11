import { Component } from '@angular/core';
import { TaskService } from 'src/services/task-dialog.service';

@Component({
  selector: 'app-defaultview',
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss']
})
export class DefaultViewComponent {

  constructor(public newTaskService: TaskService) {

  }

  createNewTask() {
    this.newTaskService.showDialog.next(true);
  }


}
