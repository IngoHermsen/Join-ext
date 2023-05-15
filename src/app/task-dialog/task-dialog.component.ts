import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task-dialog/task-dialog.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit{
  priorityOptions: any[] = [
    { name: 'Low', value: 1 },
    { name: 'Medium', value: 2 },
    { name: 'High', value: 3 }
];

contacts = [
  { name: 'contact 1'},
  { name: 'contact 2'},
  { name: 'contact 3'},
  { name: 'contact 4'},
  { name: 'contact 5'}
];


  sidebarVisible: boolean; 

  constructor(
    public newTaskService: TaskService,
    ) { }

  ngOnInit(): void {
    this.newTaskService.showDialog.subscribe((value) => {
      this.sidebarVisible = value;
    })
  }

  taskForm = new FormGroup({
    title: new FormControl('', {nonNullable: true}),
    description: new FormControl('', {nonNullable: true}),
    assign: new FormControl('', {nonNullable: true}),
    creationDate: new FormControl(new Date(), {nonNullable: true}),
    dueDate: new FormControl('', {nonNullable: true}),
    priority: new FormControl('', {nonNullable: true}),
  })
}
