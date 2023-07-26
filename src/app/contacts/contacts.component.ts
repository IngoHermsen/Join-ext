import { Component } from '@angular/core';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  
    constructor(
      public viewService: ViewService
    ) {

    }
}
