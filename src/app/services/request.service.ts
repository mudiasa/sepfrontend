import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
    private readonly requestsEndPoint = 'http://localhost:5000/api/requests';

    constructor(private http: Http) { }

    getRequests() {
        return this.http.get(this.requestsEndPoint)
            .pipe(map(res => res.json()),
                catchError(error => {
                    return throwError("Something went wrong");
                }));
    }

    create(obj) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.requestsEndPoint, obj, options)
            .pipe(map(res => res.json()),
                catchError(error => {
                    return throwError("Something went wrong");
                }));
    }



}
