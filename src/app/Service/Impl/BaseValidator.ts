import {Value}                from "@ng-app-framework/core";
import {Observable, Observer} from "rxjs/Rx";
import {ValidationRule}       from "../Interface/ValidationRule";
import {Validator}            from "../Interface/Validator";
import {ValidatorException}   from "../../Exception/ValidatorException";

export class BaseValidator implements Validator, ValidationRule {
    name: string;
    type: Function;
    nullable: boolean;

    constructor(name: string, type: Function, nullable: boolean = false) {
        this.name     = name;
        this.type     = type;
        this.nullable = nullable;
    }

    public validate$(value: any) {
        return new Observable(observer => {
            try {
                if (this.isAndCanBeEmpty(value)) {
                    return observer.complete();
                }
                if (!(this.isValueOfType(value, this.type))) {
                    return observer.error(new ValidatorException(`${this.name} was not of type ${this.type.name}`));
                }
                this.applyRule(value, observer);
            } catch (e) {
                observer.error(e);
            }
        });
    }

    protected isAndCanBeEmpty(value) {
        if (!Value.isNotNull(value)) {
            if (this.nullable) {
                return true;
            }
            throw new ValidatorException(`${this.name} was not provided and is required`);
        }
        return false;
    }

    private isValueOfType(value: any, type: Function) {
        return Value.isTypeOf(type, value);
    }

    public applyRule(value: any, observer: Observer<any>) {
        observer.complete();
    };
}
