<div style="
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #f8f9fa;
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    font-size: 14px;
    z-index: 1000;
    width: 180px;
">
  <h3 style="margin-top: 0; font-size: 16px;">Contents</h3>
  <a href="#CommonModule" style="display: block; text-decoration: none; margin: 5px 0;">CommonModule</a>
  <a href="#Pipe" style="display: block; text-decoration: none; margin: 5px 0;">Pipe</a>
</div>

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

## loadComponent Vs loadChildren
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