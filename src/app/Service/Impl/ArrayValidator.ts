import {Observer} from "rxjs";
import {ValidationRule} from "../Interface/ValidationRule";
import {ContainerValidator} from "./ContainerValidator";
import {ValidatorException} from "../../Exception/ValidatorException";

export class ArrayValidator extends ContainerValidator {
    rule: ValidationRule;

    constructor(name: string, rule: ValidationRule, nullable: boolean = false) {
        super(name, Array, nullable);
        this.rule = rule;
    }

    public applyRule(value: any, observer: Observer<any>) {
        this.validateEmpty(value);
        this.validateProvided(value, observer);
    }

    private validateProvided(value: any, observer: Observer<any>) {
        this.validateElementsInArray(value, observer);
    }

    private validateElementsInArray(value: any, observer: Observer<any>) {
        this.validateElements(
            value,
            (element) => this.rule.validate$(element),
            () => super.applyRule(value, observer))
            .subscribe({error: (err) => observer.error(`${this.name}: ${err}`)});
    }

    private validateEmpty(value: any) {
        if (!this.nullable && this.isEmpty(value)) {
            throw new ValidatorException(`'${this.name}' did not have any elements`);
        }
    }

    private isEmpty(value) {
        return !value || value.length === 0;
    }
}
