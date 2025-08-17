import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../model/user';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {}
  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const newUser: User = this.userForm.value;

      // Post to API
      this.userService.addUser(newUser).subscribe({
        next: (user) => {
          this.successMessage =
            'User ' + user.username + ' added successfully!';
          this.userForm.reset(); // clear form
        },
        error: () => {
          this.successMessage = 'Failed to add user.';
        },
      });
    }
  }
}
