import {Observer} from "rxjs";
import {NumberValidator} from "./NumberValidator";
import {ValidatorException} from "../../Exception/ValidatorException";

export class FloatValidator extends NumberValidator {

    constructor(name: string, nullable: boolean = false) {
        super(name, Number, nullable);

    }

    public applyRule(value: any, observer: Observer<any>) {
        if (this.isInteger(value)) {
            throw new ValidatorException(`${this.name} was not a float`);
        }
        super.applyRule(value, observer);
    }
}
