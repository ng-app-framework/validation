import {Observable} from "rxjs/Rx";
import {BaseValidator} from "./BaseValidator";

export class ContainerValidator extends BaseValidator {

    validateElements(listToIterate: any[], onEach: (element: any) => Observable<any>, onComplete: () => void) {
        return Observable.from(listToIterate)
            .flatMap(element => onEach(element))
            .finally(() => onComplete());
    }
}
