import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';
import { TaskService } from 'src/services/task-dialog/task-dialog.service';


@Component({
  selector: 'app-defaultview',
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss']
})
export class DefaultViewComponent {
  
// example JSON for testing dropdown:
  projects: any[] = [
    {id: 1, name: 'project 1'},
    {id: 2, name: 'project 2'},
    {id: 3, name: 'project 3'},
  ]


  constructor(
    public taskService: TaskService,
    public authService: AuthService,
    ) {

    }

  openTaskDialog() {
    this.taskService.showDialog.next(true);
  }


}
