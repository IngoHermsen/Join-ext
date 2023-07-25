import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task/task.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
import { SelectButton } from 'primeng/selectbutton';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})

export class TaskDialogComponent {
  minDueDate = new Date()
  
  @ViewChild('assignUsers') userMultiSelect: MultiSelect;
  @ViewChild('priorityButtons') prioritySelection: SelectButton;

  priorityOptions: any[] = [
    { name: 'Low' },
    { name: 'Medium' },
    { name: 'High', }
  ];

  contacts = [
    { name: 'contact 1' },
    { name: 'contact 2' },
    { name: 'contact 3' },
    { name: 'contact 4' },
    { name: 'contact 5' }
  ];

  constructor(
    public taskService: TaskService,
    public viewService: ViewService,
  ) { }



  // formGroup
  taskForm = new FormGroup({
    title: new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(25),
        ]
      },

    ),
    description: new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(150)
        ]
      }
    ),
    assignedUsers: new FormControl([],
      { nonNullable: true }
    ),

    creationDate: new FormControl(new Date(),
      {
        nonNullable: true,
        validators: [
          Validators.required,
        ]
      }
    ),
    dueDate: new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
        ]
      }

    ),
    priority: new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
        ]
      }
    ),
  })

  // formGroup END

  submitForm() {

    this.taskService.createNewTask(this.taskForm.value);
    this.viewService.showDialog.next(false);

    this.taskForm.reset()
  }

  // !!!! DELETE IF NOT NECESSARY ANYMORE !!!!  for testing purpose:

  logUsers() {
    // console.log(this.assignUsersInput.value)
  }

  logPriority() {
    // console.log(this.prioritySelection.value);
  }
}
