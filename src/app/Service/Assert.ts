import {StringValue, Value} from "@ng-app-framework/core";

export interface AssertOptions {
    name?: string;
    value?: any;
    method?: string;
    nullable?: boolean;
    type?: Function;
    container?: any;
}

export class Assert {

    static shouldBypassValidation(value, nullable) {
        return nullable && !Value.isNotNull(value);
    }

    static validate(options: AssertOptions) {
        Assert[options.method](options);
    }

    static instanceOf({name, value, type, nullable}: AssertOptions) {
        if (Assert.shouldBypassValidation(value, nullable)) {
            return;
        }
        if (!Value.isInstanceOf(value, type)) {
            throw new Error(Assert.getInstanceErrorMessage(name, type));
        }
    }

    static provided({name, value, nullable}: AssertOptions) {
        if (!nullable && !value) {
            throw new Error(`The value for '${name}' was either empty or undefined`);
        }
    }

    static boolean({name, value, nullable}: AssertOptions) {
        if (Assert.shouldBypassValidation(value, nullable)) {
            return;
        }
        if (!Value.isBoolean(value)) {
            throw new Error(Assert.getTypeErrorMessage(name, Boolean));
        }
    }

    static string({name, value, nullable}: AssertOptions) {
        if (Assert.shouldBypassValidation(value, nullable)) {
            return;
        }
        if (!Value.hasLength(value)) {
            Assert.provided({name, nullable});
        }
        if (!Value.isString(value)) {
            throw new Error(Assert.getTypeErrorMessage(name, String));
        }
    }

    static stringInList({name, value, container, nullable}: AssertOptions) {
        Assert.string({name, value, nullable});

        if (StringValue.isPopulated(value)) {
            if (!Value.isArray(container)) {
                throw new Error(`The container for '${name}' was not an array.`);
            }

            if (!Value.contains(container, value)) {
                throw new Error(`The value for '${name}' of '${value}' was not in the list '${container.join(',')}'`)
            }
        }
    }

    static number({name, value, nullable}: AssertOptions) {
        if (Assert.shouldBypassValidation(value, nullable)) {
            return;
        }

        if (!Value.isProvided(value)) {
            Assert.provided({name, nullable});
        }
        if (!Value.isNumber(value)) {
            throw new Error(Assert.getTypeErrorMessage(name, Number));
        }
    }

    static array({name, value, nullable}: AssertOptions) {
        if (Assert.shouldBypassValidation(value, nullable)) {
            return;
        }
        if (!Value.isArray(value)) {
            throw new Error(Assert.getTypeErrorMessage(name, Array));
        }
    }

    static arrayOfStrings({name, value, nullable}: AssertOptions) {
        Assert.array({name, value, nullable});
        if (Value.hasArrayElements(value)) {
            for (let i = 0; i < value.length; i++) {
                Assert.string({name: name + '[' + i + ']', value: value[i]});
            }
        }
    }

    static object({name, value, nullable}: AssertOptions) {
        if (Assert.shouldBypassValidation(value, nullable)) {
            return;
        }

        if (!Value.isInstanceOf(value, Object)) {
            throw new Error(Assert.getTypeErrorMessage(name, Object));
        }
    }

    protected static getTypeErrorMessage(name: string, type: Function) {
        return `The value for '${name}' is not a ${type.name}`;
    }

    protected static getInstanceErrorMessage(name: string, type: Function) {
        return `The value for '${name}' is not an instance of ${type.name}`;
    }
}
