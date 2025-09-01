# Contents
[CommonModule](#CommonModule) | [Pipe](#Pipe) | [Routing](#Routing) | 
[Lazy Load](#loadComponent-Vs-loadChildren) | [Service](#Service) | [Dropdown](#Dropdown) | 
[Search](#Search) | [Standalone-app](#Standalone-app) | [Form-Validation](#Form-Validation) | 
[CheckBox](#CheckBox-with-for-loop) | [ForLoop](#CheckBox-with-for-loop)


## Routing
```typescript
const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect empty path
    { path: '**', component: PageNotFoundComponent }, // Wildcard route for 404
    {
      path: 'my-page',
      loadComponent: () =>
         import('./my-input/my-input.component').then(m => m.MyInputComponent)
   }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
```
## CommonModule
- CommonModule provides Angular's most commonly used directives and pipes.
- You don’t import it in AppModule because BrowserModule already includes it.
- You must import it in feature modules.
- It makes *ngIf, *ngFor, ngSwitch, ngClass, etc., work.

## loadComponent-Vs-loadChildren
1. loadChildren, old style
    - Module level
    - Only if using feature modules
2. loadComponent
    - For standalone component
    - Component level
    - Recommended for 14+
    - Faster
    - add <router-outlet> in app.component.html — otherwise, lazy-loaded components won’t display.
## Pipe
- Create pipe as 
```typescript
@Pipe({
   name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
      transform(value: string, args?: number): string {
      if(!value) return "";
      if(value.length <= args) return value;
      return value.substring(0, args )+ "...";
   }
}
```
- Pass param like
```html
<div>{{ name | truncate : 5 }}</div>
```
### Pure and Impure Pipes
1. Pure
   - Default type of pipe. 
   - Executed only when input changes. 
   - Highly performant. 
   - Angular caches the result until the input value changes. 
   - Most built-in pipes are pure.
   - Example
     - uppercase, lowercase, date, currency, number, async
2. Impure Pipes
   - Called on every change detection cycle, even if the input hasn’t changed. 
   - More expensive than pure pipes. 
   - Used when dealing with mutable data like arrays, objects, or external sources.
   - How to make impure pipe
     ```typescript
     @Pipe({
          name: 'pipeName',
          pure: false
       })
     ```
   - When to use impure pipes:
     - When working with real-time data. 
     - When modifying an array or object in place.
## Service
```Typescript
@Injectable({
  providedIn: 'root',
})

export class MyApiService {
  constructor(private http: HttpClient) {}
  basePath = 'https://jsonplaceholder.typicode.com/';
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.basePath + 'users');
  }
}
```

## Dropdown
```html
<select [(ngModel)]="selectedType" (change)= "fetchData()">
   <option value="users">Users</option>
   <option value="posts">Posts</option>
</select>
```
```Typescript
selectedType = 'users'; // default value
```

## Search
```html
  <input type="text" placeholder="Enter name to filter" [formControl]= "searchByName" />
```
```Typescript
  searchByName = new FormControl('');
  filterdUsers: User[] = [];
  
  ngOnInit() {
    this.searchByName
       .valueChanges
       .pipe(debounceTime(500))
       .subscribe((text) => {
         this.getFilteredUser(text);
       });
  }
  
 getFilteredUser(filterText: string) {
       if (!filterText.trim()) {
         this.filterdUsers = this.users;
       } else {
         this.filterdUsers = this.users.filter((u) =>
           u.name.toLowerCase().includes(filterText.toLowerCase())
         );
       }
  }
```
## Form-Validation
in module 
```Typescript
import { ReactiveFormsModule } from '@angular/forms';
```
```html
<form [formGroup]="userForm" (ngSubmit)="submitUser()">
  <label>Name :</label>
  <input type="text" formControlName="name" />
  <div *ngIf="userForm.get('name')?.touched && userForm.get('name')?.invalid">
    <small *ngIf="userForm.get('name')?.errors?.['required']">Mandatory</small>
    <small *ngIf="userForm.get('name')?.errors?.['minlength']">Min 3</small>
  </div>
  <br />
  <label>Email :</label>
  <input type="email" formControlName="email" />
  <div *ngIf="userForm.get('email')?.touched && userForm.get('email')?.invalid">
    <small *ngIf="userForm.get('email')?.errors?.['required']">Mandatory</small>
    <small *ngIf="userForm.get('email')?.errors?.['email']"
      >Enter correct format</small
    >
  </div>
  <br />
  <button type="submit" [disabled]="userForm.invalid">Submit</button>
</form>

```
```Typescript
export class UserComponent implements OnInit{
  constructor(private fb : FormBuilder){}

  users: User[]=[];

  userForm!: FormGroup;
  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['',[Validators.required, Validators.email]]
    });
  }
  submitUser(){
    if(this.userForm.valid){
      this.users = this.userForm.value;
      this.userForm.reset();
    }
  }
}
```
## Standalone-app

### How to add routing module
1. Create app-route.ts
```Typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './app/home-component/home-component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
]
```
2. In main.ts
```Typescript
import { provideRouter, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true, //✅ This one is NEEDED
  imports:[RouterOutlet], //✅ This one is NEEDED
  templateUrl: './app-component.html', //✅ This one is NEEDED
})
export class App {
  name = 'Angular';
}
bootstrapApplication(App, {
  providers: [
  provideRouter(routes), //✅ This one is for router
  provideHttpClient() //✅ This one is for Http
  ], 
}); 
```
## CheckBox-with-for-loop
```html
<div *ngFor="let toDo of toDos; let i = index">
   <input type="checkbox" [checked]="toDo.isDone" (change)="updateIsDone(i)"/>
   <!-- toDo.isDone is boolean type-->
</div>
```

## Fork-Join
```Typescript
ngOnInit(): void {
 forkJoin({
   u: this.service.getUsers(),
   p: this.service.getPosts()
 }).subscribe({
   next: (res) => {
     this.users = res.u;
     this.posts = res.p;
   }
 })
}
```
