import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task/task.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
import { SelectButton } from 'primeng/selectbutton';
import { ViewService } from 'src/services/view/view.service';
import { ContactService } from 'src/services/contact/contact.service';
import { Timestamp } from '@angular/fire/firestore';
import { Task } from 'src/models/task';
import { Contact } from 'src/models/contact';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})

export class TaskDialogComponent implements OnInit {
  assignedContacts: Array<Contact>;
  dueDate: Date;
  minDueDate = new Date();

  @ViewChild('assignUsers') userMultiSelect: MultiSelect;
  @ViewChild('priorityButtons') prioritySelection: SelectButton;

  priorityOptions: any = [
    { name: 'Low' },
    { name: 'Medium' },
    { name: 'High', }
  ];

  contacts;

  constructor(
    public taskService: TaskService,
    public viewService: ViewService,
    public contactService: ContactService,
  ) {
    console.log(this.contacts);

  }

  ngOnInit(): void {
    this.dueDate = new Date()

    this.taskService.activeTask.subscribe((task) => {
      if (task) {
        this.setTaskFormValues(task)
      } else {
        this.taskForm.reset();
      }
    })

  }


  ngOnDestroy() {
  }

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

  setTaskFormValues(taskObj: Task) {
    this.assignedContacts = [];
    const dueDateAsDate = this.taskService.transformDueDate(taskObj.dueDate['seconds'], true);
    this.dueDate = new Date(dueDateAsDate);
    this.setAssignedContacts(taskObj.assignedUsers)

    this.taskForm.patchValue({
      title: taskObj.title,
      description: taskObj.description,
      priority: taskObj.priority,
      assignedUsers: taskObj.assignedUsers,

    })

    console.log(this.taskForm);

  }

  setAssignedContacts(assignedUsers) {
    this.assignedContacts = [];
    console.log(this.contactService.usersContacts);
    
    assignedUsers.map((user) => {
      const contactList = this.contactService.usersContacts
      for (let i = 0; i < contactList.length; i++) {

        if (user.uid == contactList[i].uid) {

          this.assignedContacts.push(contactList[i]);
          break;
        }
      }
    }
    )

  }

  logAssignedUsers() {


  }
}
