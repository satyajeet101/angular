import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { Post } from '../model/post';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  apiUrl: string = 'https://jsonplaceholder.typicode.com';

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/users');
  }
  getPost(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl + '/posts');
  }
  addUser(user: User) {
    return this.http.post<User>(this.apiUrl + '/users', user);
  }
}
