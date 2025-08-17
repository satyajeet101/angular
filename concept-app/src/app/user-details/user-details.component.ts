import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../model/user';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent {
  @Input() user!: User; // Parent → Child
  @Output() notifyParent = new EventEmitter(); // Child → Parent

  sendMessageToParent() {
    this.notifyParent.emit(
      `User ${this.user.username} clicked "Notify" button`
    );
  }
}
