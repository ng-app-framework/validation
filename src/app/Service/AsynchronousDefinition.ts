import {Validator} from "./Interface/Validator";
import {Observable} from "rxjs";

export class AsynchronousDefinition implements Validator {
    constructor(public validator: Validator) {

    }

    validate$(value: any): Observable<any> {
        return this.validator.validate$(value);
    }
}
