import {
    Validator
} from "../../src/app/Service/Interface/Validator";
import {BaseValidator} from "../../src/app/Service/Impl/BaseValidator";
import {BooleanValidator} from "../../src/app/Service/Impl/BooleanValidator";
import {StringValidator} from "../../src/app/Service/Impl/StringValidator";
import {NumberValidator} from "../../src/app/Service/Impl/NumberValidator";
import {IntegerValidator} from "../../src/app/Service/Impl/IntegerValidator";
import {FloatValidator} from "../../src/app/Service/Impl/FloatValidator";
import {ArrayValidator} from "../../src/app/Service/Impl/ArrayValidator";
import {ObjectValidator} from "../../src/app/Service/Impl/ObjectValidator";

describe('Validator', () => {
    let validator: BaseValidator = null;

    function assertValid(validator, value, done) {
        let erred = false;
        let error   = '';
        validator.validate$(value)
            .finally(() => {
                expect(erred).toBeFalsy('The validation should not have erred. Message: ' + error);
                done()
            })
            .subscribe({
                error: (err) => {
                    erred = true;
                    error   = err.toString();
                }
            });
    }

    function assertInvalid(validator, value, done) {
        let erred = false;
        let error   = '';
        validator.validate$(value)
            .finally(() => {
                expect(erred).toBeTruthy('The validation should have erred.');
                done();
            })
            .subscribe({
                error: (err) => {
                    erred = true;
                    error   = err.toString();
                }
            });
    }

    function assertStringIsValid() {
        it('should validate that a string is valid', (done) => {
            assertValid(validator, 'Bob', done);
        });
    }

    function assertStringIsInvalid() {
        it('should validate that a string is invalid', (done) => {
            assertInvalid(validator, 'Bob', done);
        });
    }

    function assertNumberIsValid() {
        it('should validate that a number is valid', (done) => {
            assertValid(validator, 1, done);
        });
        it('should validate that a float is valid', (done) => {
            assertValid(validator, 1.2, done);
        });
    }

    function assertNumberIsInvalid() {
        it('should validate that an integer is invalid', (done) => {
            assertInvalid(validator, 1, done);
        });

        it('should validate that a float is invalid', (done) => {
            assertInvalid(validator, 1.2, done);
        });
    }

    function assertBooleanIsValid() {
        it('should validate that true is valid', (done) => {
            assertValid(validator, true, done);
        });
        it('should validate that false is valid', (done) => {
            assertValid(validator, false, done);
        });
    }

    function assertBooleanIsInvalid() {
        it('should validate that true is invalid', (done) => {
            assertInvalid(validator, true, done);
        });
        it('should validate that false is invalid', (done) => {
            assertInvalid(validator, false, done);
        });
    }

    function assertObjectIsValid() {

        it('should validate that an object is valid', (done) => {
            assertValid(validator, {test: 'value'}, done);
        });
    }

    function assertObjectIsInvalid() {

        it('should validate that an object is invalid', (done) => {
            assertInvalid(validator, {test: 'value'}, done);
        });
    }

    function assertArrayIsValid() {

        it('should validate that an array is valid', (done) => {
            assertValid(validator, ['test value'], done);
        });
    }

    function assertArrayIsInvalid() {

        it('should validate that an array is invalid', (done) => {
            assertInvalid(validator, ['test value'], done);
        });
    }

    function assertNullability(validatorType) {

        it('should allow null values when nullable is true', (done) => {
            if (validatorType === NumberValidator || validatorType === BaseValidator) {
                validator = new validatorType('test', Number, true);
            } else if (validatorType === ArrayValidator) {
                validator = new ArrayValidator('test', new StringValidator('testIndex'), true);
            } else if (validatorType === ObjectValidator) {
                validator = new ObjectValidator('test', {
                    testMe: new StringValidator('testMe')
                }, true);
            } else {
                validator = new validatorType('test', true);
            }
            assertValid(validator, null, done);
        });
        it('should NOT allow null values when nullable is false', (done) => {
            validator = new validatorType('test');
            assertInvalid(validator, null, done);
        });
    }

    describe('BaseValidator', () => {
        assertNullability(BaseValidator);
    });
    describe('StringValidator', () => {
        beforeEach(() => {
            validator = new StringValidator('test');
        });
        assertStringIsValid();
        assertNumberIsInvalid();
        assertBooleanIsInvalid();
        assertNullability(StringValidator);
    });
    describe('BooleanValidator', () => {
        beforeEach(() => {
            validator = new BooleanValidator('test');
        });
        assertBooleanIsValid();
        assertStringIsInvalid();
        assertNumberIsInvalid();
        assertNullability(BooleanValidator);
    });
    describe('NumberValidator', () => {
        beforeEach(() => {
            validator = new NumberValidator('test');
        });
        assertNumberIsValid();
        assertStringIsInvalid();
        assertBooleanIsInvalid();
        assertObjectIsInvalid();
        assertArrayIsInvalid();
        assertNullability(NumberValidator);
    });
    describe('IntegerValidator', () => {
        beforeEach(() => {
            validator = new IntegerValidator('test');
        });
        it('should validate that an integer is valid', (done) => {
            assertValid(validator, 2, done);
        });
        it('should validate that a float is invalid', (done) => {
            assertInvalid(validator, 1.2, done);
        });
        assertStringIsInvalid();
        assertBooleanIsInvalid();
        assertObjectIsInvalid();
        assertArrayIsInvalid();
        assertNullability(IntegerValidator);
    });
    describe('FloatValidator', () => {
        beforeEach(() => {
            validator = new FloatValidator('test');
        });
        it('should validate that an integer is invalid', (done) => {
            assertInvalid(validator, 2, done);
        });
        it('should validate that a float is valid', (done) => {
            assertValid(validator, 1.2, done);
        });
        assertStringIsInvalid();
        assertBooleanIsInvalid();
        assertObjectIsInvalid();
        assertArrayIsInvalid();
        assertNullability(FloatValidator);
    });
    describe('ArrayValidator', () => {
        beforeEach(() => {
            validator = new ArrayValidator('test', new StringValidator('test array element'));
        });
        assertNumberIsInvalid();
        assertStringIsInvalid();
        assertBooleanIsInvalid();
        assertObjectIsInvalid();
        it('should validate that an array is invalid if not nullable', (done) => {
            assertInvalid(validator, [], done);
        });
        it('should validate that an array is valid if nullable', (done) => {
            validator.nullable = true;
            assertValid(validator, [], done);
        });
        it('should validate that elements in the array must be of the type', (done) => {
            assertInvalid(validator, [1], done);
        });

        assertNullability(ArrayValidator);
    });
    describe('ObjectValidator', () => {
        beforeEach(() => {
            validator = new ObjectValidator('test', {
                testProperty: new StringValidator('test object element')
            });
        });
        assertNumberIsInvalid();
        assertStringIsInvalid();
        assertBooleanIsInvalid();
        assertArrayIsInvalid();
        assertNullability(ObjectValidator);

        it('should validate that an object is invalid if not nullable', (done) => {
            assertInvalid(validator, {}, done);
        });
        it('should validate that an object is valid if nullable', (done) => {
            validator.nullable = true;
            assertValid(validator, {}, done);
        });
        it('should validate that an object is invalid if not an object', (done) => {
            assertInvalid(validator, [], done);
        });
        it('should validate that elements in the object must be of the type', (done) => {
            assertInvalid(validator, {testProperty: 1}, done);
        });
    });
    describe('Complex Definitions', () => {
        beforeEach(() => {
            validator = new ObjectValidator('test', {
                testProperty : new StringValidator('testProperty'),
                testProperty2: new NumberValidator('testProperty2', Number, true),
                testProperty3: new ArrayValidator('testProperty3', new ObjectValidator('testProperty3 Object', {
                    testMe: new StringValidator('testMe')
                }, true))
            });
        });
        it('should validate a valid object properly (1)', (done) => {
            assertValid(validator, {
                testProperty : 'test',
                testProperty3: [
                    {}
                ]
            }, done);
        });
        it('should validate a valid object properly (2)', (done) => {
            assertValid(validator, {
                testProperty : 'test',
                testProperty2: null,
                testProperty3: [
                    {
                        testMe: 'test'
                    }
                ]
            }, done);
        });
        it('should validate a valid object properly (3)', (done) => {
            assertValid(validator, {
                testProperty : 'test',
                testProperty2: 2,
                testProperty3: [
                    {
                        testMe: 'test'
                    }
                ]
            }, done);
        });
        it('should validate a valid object properly (4)', (done) => {
            let objectValidator: ObjectValidator              = <ObjectValidator>validator;
            objectValidator.properties.testProperty3.nullable = true;
            assertValid(validator, {
                testProperty : 'test',
                testProperty2: 2,
                testProperty3: []
            }, done);
        });
        it('should validate a invalid object properly', (done) => {
            assertInvalid(validator, {
                testProperty : 'test',
                testProperty2: 2,
                testProperty3: []
            }, done);
        });

    });
});
