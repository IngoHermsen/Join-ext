import { Component, OnInit } from '@angular/core';
import { NewTaskService } from '../new-task.service';

@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.scss']
})
export class NewTaskDialogComponent implements OnInit{
  sidebarVisible: boolean; 

  constructor(
    public newTaskService: NewTaskService,
    ) { }

  ngOnInit(): void {
    this.newTaskService.showDialog.subscribe((value) => {
      this.sidebarVisible = value;
    })
  }
}
