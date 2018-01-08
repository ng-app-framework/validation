import {Observable} from "rxjs";

export interface Validator {
    validate$(value: any): Observable<any>;
}

