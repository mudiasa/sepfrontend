import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';

    @Injectable({
    providedIn: 'root'
    })
    export class PreferenceService {

        private readonly preferencesEndPoint = 'http://localhost:5000/api/preferences';

        constructor(private http: Http) { }

        getPreferences() {
            return this.http.get(this.preferencesEndPoint)
                .pipe(map(res => res.json()),
                    catchError(error => {
                        return throwError("Something went wrong");
                    }));
        }

        create(obj) {
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });
            return this.http.post(this.preferencesEndPoint, obj, options)
                .pipe(map(res => res.json()),
                    catchError(error => {
                        return throwError("Something went wrong");
                    }));
        }

    }
