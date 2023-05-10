import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task-dialog.service';

@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class NewTaskDialogComponent implements OnInit{
  sidebarVisible: boolean; 

  constructor(
    public newTaskService: TaskService,
    ) { }

  ngOnInit(): void {
    this.newTaskService.showDialog.subscribe((value) => {
      this.sidebarVisible = value;
    })
  }
}
