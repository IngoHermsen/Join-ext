import { Component } from '@angular/core';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  btnItems: any[] = [
  {
    label: 'Delete',
      icon: 'pi pi-trash',
        command: () => {
          // this.delete();
        }
  },

  ]
  
}
