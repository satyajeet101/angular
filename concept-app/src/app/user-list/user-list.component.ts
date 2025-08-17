import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { Post } from '../model/post';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  constructor(private userService: UserService) {}

  users: User[] = [];
  posts: Post[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedType: string = 'users';

  filteredUsers: User[] = [];
  searchControl = new FormControl('');

  //for parent child connection code
  selectedUser: User | null = null;

  ngOnInit(): void {
    this.fetchData();
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((searchText) => {
        this.filteredUser(searchText || '');
      });
  }
  filteredUser(searchText: string) {
    if (!searchText.trim()) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter((u) =>
        u.username.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  // when child notifies
  handleChildMessage(msg: string) {
    alert('Child says: ' + msg);
  }

  fetchData() {
    if (this.selectedType === 'users') {
      this.userService.getUser().subscribe({
        next: (user) => {
          this.users = user;
          this.filteredUsers = user;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Unable to load Users';
          this.loading = false;
        },
        complete: () => {
          console.log('DONE!!');
        },
      });
    } else if (this.selectedType === 'posts') {
      this.userService.getPost().subscribe({
        next: (post) => {
          this.posts = post;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Unable to load Posts';
          this.loading = false;
        },
        complete: () => {
          console.log('DONE!!');
        },
      });
    }
  }
}
