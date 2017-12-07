import {BaseValidator} from "./BaseValidator";

export class BooleanValidator extends BaseValidator {
    constructor(name: string, nullable: boolean = false) {
        super(name, Boolean, nullable);

    }
}
