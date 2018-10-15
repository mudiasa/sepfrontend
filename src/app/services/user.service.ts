import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private readonly usersEndPoint = 'http://localhost:5000/api/users';

    constructor(private http: Http) { }

    getUsers() {
        return this.http.get(this.usersEndPoint)
            .pipe(map(res => res.json()),
                catchError(error => {
                    return throwError("Something went wrong");
                }));
    }

    create(obj) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.usersEndPoint, obj, options)
            .pipe(map(res => res.json()),
                catchError(error => {
                    return throwError("Something went wrong");
                }));
    }

}
