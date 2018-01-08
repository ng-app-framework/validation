import {Observer} from "rxjs/Rx";
import {ValidationRule} from "../Interface/ValidationRule";
import {ContainerValidator} from "./ContainerValidator";
import {ValidatorException} from "../../Exception/ValidatorException";
import {Value} from "@ng-app-framework/core";

export class ObjectValidator extends ContainerValidator {
    properties: { [key: string]: ValidationRule };

    constructor(name: string, properties: { [key: string]: ValidationRule } = {}, nullable: boolean = false) {
        super(name, Object, nullable);
        this.properties = properties;
    }

    public applyRule(value: any, observer: Observer<any>) {
        this.validateEmpty(value);
        if (Value.hasProperties(value)) {
            this.validateProvided(value, observer);
            return;
        }
        observer.complete();

    }

    private validateProvided(value: any, observer: Observer<any>) {
        this.validateProperties(value, observer);
    }

    private validateProperties(value: any, observer: Observer<any>) {
        this.validateElements(
            Object.keys(this.properties),
            (element) => this.properties[element].validate$(value[element]),
            () => super.applyRule(value, observer))
            .subscribe({error: (err) => observer.error(`${this.name}: ${err}`)});
    }

    private validateEmpty(value: any) {
        if (!this.nullable && !Value.hasProperties(value)) {
            throw new ValidatorException(`'${this.name}' was not provided`);
        }
    }
}
