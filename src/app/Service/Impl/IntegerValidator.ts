import {Observer} from "rxjs";
import {NumberValidator} from "./NumberValidator";
import {ValidatorException} from "../../Exception/ValidatorException";

export class IntegerValidator extends NumberValidator {
    constructor(name: string, nullable: boolean = false) {
        super(name, Number, nullable);

    }

    public applyRule(value: any, observer: Observer<any>) {
        if (!this.isInteger(value)) {
            throw new ValidatorException(`${this.name} was not an integer`);
        }
        super.applyRule(value, observer);
    }
}
