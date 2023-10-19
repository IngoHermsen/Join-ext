import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/models/task';
import { ProjectService } from 'src/services/project/project.service';
import { TaskService } from 'src/services/task/task.service';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit, AfterViewInit {
  @Input() task: Task;
  @Input() dragging: boolean = false;
  dueDateAsString: string;
  status: string;
  showDeleteDialog: boolean = false;

  // viewElements:

  @ViewChild('taskCard') taskCardEl: ElementRef;
  @ViewChild('deleteDialog') deleteDialogEl: ElementRef;
  @ViewChild('trash') trashEl: ElementRef;

  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
    private router: Router,
    private viewService: ViewService
  ) {
    
  }

  ngOnInit(): void {    
    this.dueDateAsString = this.taskService.convertDueDate(this.task.dueDate);
    this.status = this._setStatus();    
  }

  btnItems: any[] = [
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
      }
    },
  ]

  _setStatus() {
    switch (this.task.status) {
      case 'todo': return 'to-do'; break;
      case 'inProgress': return 'in-progress'; break;
      case 'inReview': return 'in-review'; break;
      default: return 'done'; break
    }

  }

  ngAfterViewInit(): void {
    this.trashEl.nativeElement.addEventListener('click', e => {
      e.stopPropagation();
      this.toggleDeleteDialog();
    })

    this.deleteDialogEl.nativeElement.addEventListener('click', e => {
      e.stopPropagation();
    })

    this.taskCardEl.nativeElement.addEventListener('mousedown', e => {
      this.taskCardEl.nativeElement.classList.add('selected')
    })

    this.taskCardEl.nativeElement.addEventListener('mouseup', e => {
      this.taskCardEl.nativeElement.classList.remove('selected')
    })
  }

  openTaskEdit(task: Task) {
    console.log(task);
        
    this.router.navigate(['/tasks', task['taskId']], { replaceUrl: true });
    this.viewService.showSidebar('task');
    this.taskService.editMode = true;
    this.taskService.activeTask.next(task);
  }

  toggleDeleteDialog() {
    this.showDeleteDialog = !this.showDeleteDialog;
  }

}
