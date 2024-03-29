import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task/task.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
import { SelectButton } from 'primeng/selectbutton';
import { ViewService } from 'src/services/view/view.service';
import { ContactService } from 'src/services/contact/contact.service';
import { Task } from 'src/models/task';
import { Contact } from 'src/models/contact';
import { ProjectService } from 'src/services/project/project.service';
import { count } from 'rxjs';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})

export class TaskDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  assignedContacts: Contact[] = null;
  dueDate: Date;
  minDueDate = new Date();
  taskId: string | null;

  // input limits:
  titleLimit: number = 40;
  titleInputLength: number = this.titleLimit;
  descLimit: number = 150;
  descInputLength: number = this.descLimit;

  @ViewChild('titleInput') titleInputField: ElementRef;
  @ViewChild('descInput') descInputField: ElementRef;
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
    public projectService: ProjectService,
  ) {

    this.taskId = null;
  }

  ngOnInit(): void {    
    this.dueDate = new Date();
    this.taskService.activeTask.subscribe((task) => {

      if (task) {
        this._setTaskFormValues(task)
        this.taskId = task.taskId;
        this.setCounterValues();
      } else {        
        this.taskForm.reset();        
        this.titleInputLength = 0;
        this.descInputLength = 0;
      }
    })

  }

  ngAfterViewInit(): void {
    this.setCounterValues()

  }

  ngOnDestroy(): void {    
    this.titleInputLength = 0;
    this.descInputLength = 0;
  }

  // formGroup
  taskForm = new FormGroup({
    title: new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(40),
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
    this.taskService.saveTask(this.taskForm.value, this.taskId);
    this.viewService.showDialog.next(false);
    this.taskForm.reset()
  }


  _setTaskFormValues(taskObj: Task) {

    this.assignedContacts = [];
    const dueDateAsDate = new Date(taskObj.dueDate['seconds'] * 1000);
    this.dueDate = new Date(dueDateAsDate);
    this._setAssignedContacts(taskObj.assignedUsers);

    this.taskForm.patchValue({
      title: taskObj.title,
      description: taskObj.description,
      priority: taskObj.priority,

    })

  }

  _setAssignedContacts(assignedUsers: any) {
    assignedUsers.map((user: any) => {
      const contactList: Array<Contact> = this.contactService.usersContacts;
      let userIds: Array<string> = []

      for (let i = 0; i < contactList.length; i++) {

        if (user.uid == contactList[i].uid) {
          this.assignedContacts.push(contactList[i]);

          userIds.push(user.uid);
          break;
        }
      }

    }
    )
  }

  setCounterValues() {
    const titleInputLength: number = this.titleInputField.nativeElement.value.length;
    const descInputLength: number = this.descInputField.nativeElement.value.length

    this.titleInputLength = titleInputLength;
    this.descInputLength = descInputLength;
  }



}
