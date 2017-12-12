import {BaseValidator} from "./BaseValidator";
import {ValidatorException} from "../../Exception/ValidatorException";
import {StringValue} from "@ng-app-framework/core";

export class StringValidator extends BaseValidator {
    constructor(name: string, nullable: boolean = false) {
        super(name, String, nullable);

    }

    protected isAndCanBeEmpty(value) {
        if (!StringValue.isPopulated(value)) {
            if (this.nullable) {
                return true;
            }
            throw new ValidatorException(`${this.name} was not provided and is required`);
        }
        return false;
    }
}
