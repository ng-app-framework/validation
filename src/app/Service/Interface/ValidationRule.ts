import {Observer} from "rxjs";
import {Validator} from "./Validator";

export interface ValidationRule extends Validator {

    type: Function;
    name: string;
    nullable: boolean;

    applyRule(value: any, observer: Observer<any>): void;
}
