//Form Validation
userForm!: FormGroup;

constructor(private fb: FormBuilder, private userService: UserService) {}
  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div>
    <label>Username:</label>
    <input type="text" formControlName="username" />
    <div *ngIf="userForm.get('username')?.invalid && userForm.get('username')?.touched" class="error">
      <small *ngIf="userForm.get('username')?.errors?.['required']">Username is required.</small>
      <small *ngIf="userForm.get('username')?.errors?.['minlength']">Must be at least 3 characters.</small>
    </div>
  </div>
  <button type="submit" [disabled]="userForm.invalid">Submit</button>

   onSubmit() {
    if (this.userForm.valid) {
      const newUser: User = this.userForm.value;
      this.userService.addUser(newUser).subscribe({
        next: (user) => {
          this.successMessage =
            'User ' + user.username + ' added successfully!';
          this.userForm.reset();
        },
        error: () => {
          this.successMessage = 'Failed to add user.';
        },
      });
    }
  } 

  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Component interaction @Input @Output
//PARENT
handleChildMessage(msg: string) {
    alert('Child says: ' + msg);
}
<ul><li *ngFor="let u of users" (click)="selectedUser = u">
{{ u.username }} {{ u.email }}</li></ul>
<button [routerLink]="['/addUser']">Add User</button>
<app-user-details *ngIf="selectedUser" [user]="selectedUser" (notifyParent)="handleChildMessage($event)">
</app-user-details>

//CHILD
  @Input() user!: User; // Parent → Child
  @Output() notifyParent = new EventEmitter(); // Child → Parent
  sendMessageToParent() {
    this.notifyParent.emit(
      `User ${this.user.username} clicked "Notify" button`
    );
  }
<h3>User Details</h3><p><strong>Username:</strong> {{ user.username }}</p>
<p><strong>Email:</strong> {{ user.email }}</p>

<button (click)="sendMessageToParent()">Notify Parent</button>

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//SEARCH
<input placeholder="Enter search text...." [formControl]="searchControl">
searchControl = new FormControl('');
ngOnInit(): void {
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
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //DROPDOWN
<select [(ngModel)]="selectedType" (change)="fetchData()">
  <option value="users">User</option>
  <option value="posts">Post </option>
</select>
selectedType: string = 'users';
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
    } 
  }
