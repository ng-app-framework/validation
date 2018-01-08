import {Observable} from "rxjs/Rx";

export interface Validator {
    validate$(value: any): Observable<any>;
}

