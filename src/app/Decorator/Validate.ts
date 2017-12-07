import {Assert, AssertOptions} from "../Service/Assert";
import {getArgs} from "./getArgs";
import {Value} from "@ng-app-framework/core";
import 'reflect-metadata';

function getAssertionMethod(dataType: any, method?: string) {
    let attemptedMethod = dataType.name.toLowerCase();
    if (Value.isDefined(Assert[attemptedMethod])) {
        method = method || attemptedMethod;
    }
    return method || 'instanceOf';
}

// HELPER FUNCTIONS FOR DECORATORS
function getAssertionType(ruleName: string, dataType: any, value: any, optional: boolean, method?: string): AssertOptions {
    method = getAssertionMethod(dataType, method);
    return {
        name    : ruleName,
        method  : method,
        value   : value,
        type    : dataType,
        nullable: optional
    };
}

function validateMethod(descriptor: any, target: Object, propertyName: string) {
    let method       = descriptor.value;
    let argNames     = getArgs(method);
    descriptor.value = function (...args: any[]) {
        let className = this.constructor._name || this.constructor.name;
        let types     = Reflect.getOwnMetadata("design:paramtypes", target, propertyName);
        console.log(types);
        for (let index in argNames) {
            Assert.validate(
                getAssertionType(
                    `${className}:${propertyName}():${argNames[index]}`,
                    types[index],
                    args[index],
                    !!Reflect.getOwnMetadata('design:optional:' + index, target, propertyName),
                    Reflect.getOwnMetadata("design:validate:method:" + index, target, propertyName)
                )
            );
        }
        return method.apply(this, args);
    };
    return descriptor;
}

// DECORATORS

export function validate(target: Object, propertyName: string, descriptor: any) {
    return validateMethod(descriptor, target, propertyName);
}

export function optional(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata('design:optional:' + parameterIndex, true, target, propertyKey);
}

export function method(method: string) {
    return function decorator(target: Object, propertyKey: string | symbol, parameterIndex: number) {
        Reflect.defineMetadata('design:validate:method:' + parameterIndex, method, target, propertyKey);
    }
}
