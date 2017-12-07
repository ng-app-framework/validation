import {BaseValidator} from "./BaseValidator";

export class NumberValidator extends BaseValidator {

    constructor(name: string, type: Function = Number, nullable: boolean = false) {
        super(name, type, nullable);

    }

    protected isInteger(value: number) {
        return Number.isInteger(value);
    }
}
