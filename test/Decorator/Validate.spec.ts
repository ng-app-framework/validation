import {optional, validate} from "../../src/app/Decorator";
describe('Validate Decorator', () => {
    it('Should validate arguments based on a list of options (and order should not matter)', () => {
        class ValidationTest {

            @validate
            giveMeSomethingGood(arg1: string, arg2: any) {

            }

            @validate
            giveMeSomethingNullable(arg1: string, @optional arg2?: any ) {

            }
        }
        let object = new ValidationTest();
        expect(() => object.giveMeSomethingGood('here is a string', {})).not.toThrow();
        expect(() => object.giveMeSomethingGood(<any>{}, 'here is a string')).toThrow();
        expect(() => object.giveMeSomethingGood('here is a string', null)).toThrow();
        expect(() => object.giveMeSomethingNullable('here is a string', null)).not.toThrow();
    });
});
