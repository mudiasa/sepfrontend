import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventService {
    private readonly eventEndPoint = 'http://localhost:5000/api/events/';

    constructor(private http: Http) { }

    getEvents() {
        return this.http.get(this.eventEndPoint)
            .pipe(map(res => res.json()),
                catchError(error => {
                    return throwError("Something went wrong");
                }));
    }

    create(obj) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.eventEndPoint, obj, options)
            .pipe(map(res => res.json()),
                catchError(error => {
                    return throwError("Something went wrong");
                }));
    }

    update(obj, id) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.eventEndPoint + id, obj, options)
            .pipe(map(res => res.json()),
                catchError(error => {
                    return throwError("Something went wrong");
                }));
    }
}