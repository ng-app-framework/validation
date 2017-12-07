import {Assert} from "../../src/app/Service";

class TestClass {

}

class ChildTestClass extends TestClass {

}

class OtherTestClass {

}

describe('Assert', () => {

    describe('Should Bypass Validation', () => {
        describe('Should be False', () => {
            it('is not nullable', () => {
                expect(Assert.shouldBypassValidation(null, false)).toBeFalsy();
            });
            it('is provided', () => {
                expect(Assert.shouldBypassValidation(1, true)).toBeFalsy();
            });
        });
        describe('Should be True', () => {
            it('is nullable AND is NOT provided', () => {
                expect(Assert.shouldBypassValidation(null, true)).toBeTruthy();
            });
        });
    });

    function assertThrows(method, value, nullable = false, type = null, container = null) {
        expect(() => {
            Assert[method]({
                name     : '',
                value    : value,
                container: container,
                type     : type,
                nullable : nullable
            })
        }).toThrow();
    }

    function assertNoThrow(method, value, nullable = false, type = null, container = null) {
        expect(() => {
            Assert[method]({
                name     : '',
                value    : value,
                container: container,
                type     : type,
                nullable : nullable
            })
        }).not.toThrow();
    }

    describe('Instance Of', () => {
        describe('Should Not Throw', () => {
            it('is nullable and not provided', () => {
                assertNoThrow('instanceOf', null, true, Object);
            });
            it('is the same class', () => {
                assertNoThrow('instanceOf', new TestClass(), false, TestClass);
            });
            it('is a derived class', () => {
                assertNoThrow('instanceOf', new ChildTestClass(), false, TestClass);
            });
        });
        describe('Should Throw', () => {
            it('is not provided', () => {
                assertThrows('instanceOf', null, false, TestClass);
            });
            it('is not derived from the class', () => {
                assertThrows('instanceOf', new OtherTestClass(), false, TestClass);
            })
        })
    });
    describe('Provided', () => {
        describe('Should Not Throw', () => {
            it('is nullable and not provided', () => {
                assertNoThrow('provided', null, true);
            });
            it('is nullable and provided', () => {
                assertNoThrow('provided', 1, true);
            });
            it('is not nullable and provided', () => {
                assertNoThrow('provided', 1);
            });
        });
        describe('Should Throw', () => {
            it('is not nullable and not provided', () => {
                assertThrows('provided', null);
            });
        })
    });
    describe('Boolean', () => {
        describe('Should Not Throw', () => {
            it('is nullable and not provided', () => {
                assertNoThrow('boolean', null, true);
            });
            it('is not nullable and is boolean', () => {
                assertNoThrow('boolean', true);
                assertNoThrow('boolean', false);
            });
        });
        describe('Should Throw', () => {
            it('is wrong datatype', () => {
                assertThrows('boolean', 1, true);
                assertThrows('boolean', 'string', true);
            });
        });
    });
    describe('String', () => {
        describe('Should Not Throw', () => {
            it('is nullable and not provided', () => {
                assertNoThrow('string', null, true);
                assertNoThrow('string', '', true);
            });
        });
        describe('Should Throw', () => {
            it('is not nullable and not provided', () => {
                assertThrows('string', null);
                assertThrows('string', '');
            });
            it('is not a string', () => {
                assertThrows('string', 12, true);
                assertThrows('string', new TestClass(), true);
                assertThrows('string', [], true);
            })
        });
    });
    describe('String in List', () => {
        describe('Should Not Throw', () => {
            it('is nullable and not provided', () => {
                assertNoThrow('stringInList', null, true, null, ['a', 'b', 'c']);
                assertNoThrow('stringInList', '', true, null, ['a', 'b', 'c']);
            });
            it('is provided and in the list', () => {
                assertNoThrow('stringInList', 'a', false, null, ['a', 'b', 'c']);
                assertNoThrow('stringInList', 'b', false, null, ['a', 'b', 'c']);
                assertNoThrow('stringInList', 'c', false, null, ['a', 'b', 'c']);
            });
        });
        describe('Should Throw', () => {
            it('is not a string', () => {
                assertThrows('stringInList', null, false, null, ['a', 'b', 'c']);
                assertThrows('stringInList', {}, false, null, ['a', 'b', 'c']);
            });
            it('is provided and not in the list', () => {
                assertThrows('stringInList', 'd', false, null, ['a', 'b', 'c']);
            });
            it('does not receive a proper array', () => {
                assertThrows('stringInList', 'd', false, null, {});
                assertThrows('stringInList', 'd', false, null);
            });
        });
    });
    describe('Number', () => {
        describe('Should Not Throw', () => {
            it('is nullable and not provided', () => {
                assertNoThrow('number', null, true);
            });
            it('is an integer', () => {
                assertNoThrow('number', 1);
            });
            it('is an float', () => {
                assertNoThrow('number', 0.5);
            });
        });
        describe('Should Throw', () => {
            it('is not nullable and not provided', () => {
                assertThrows('number', null);
            });
            it('is not a number', () => {
                assertThrows('number', 'string');
                assertThrows('number', {});
                assertThrows('number', []);
                assertThrows('number', null);
            });
        });
    });
    describe('Array', () => {
        describe('Should Not Throw', () => {
            it('is nullable and not provided', () => {
                assertNoThrow('array', null, true);
            });
            it('is provided and is an array', () => {
                assertNoThrow('array', []);
            })
        });
        describe('Should Throw', () => {
            it('is not nullable and not provided', () => {
                assertThrows('array', null);
            });
            it('is not an array', () => {
                assertThrows('array', {});
                assertThrows('array', 'string');
                assertThrows('array', 2);
            });
        });
    });
    describe('Array Of Strings', () => {
        describe('Should Not Throw', () => {
            it('is nullable and not provided', () => {
                assertNoThrow('arrayOfStrings', null, true);
            });
            it('is provided and is an array', () => {
                assertNoThrow('arrayOfStrings', []);
            });
            it('is an array of strings', () => {
                assertNoThrow('arrayOfStrings', ['string']);
            });
        });
        describe('Should Throw', () => {
            it('is not nullable and not provided', () => {
                assertThrows('arrayOfStrings', null);
            });
            it('is not an array', () => {
                assertThrows('arrayOfStrings', {});
                assertThrows('arrayOfStrings', 'string');
                assertThrows('arrayOfStrings', 2);
            });
            it('is an array of random types', () => {
                assertThrows('arrayOfStrings', ['string', 1, {}]);
            });
            it('is an array with no strings', () => {
                assertThrows('arrayOfStrings', [1, 2, 3]);
            })
        });
    });
    describe('Object', () => {
        describe('Should Not Throw', () => {
            it('is nullable and not provided', () => {
                assertNoThrow('object', null, true);
            });
            it('is provided', () => {
                assertNoThrow('object', {});
            });
            it('is an instance of a class', () => {
                assertNoThrow('object', new TestClass());
            })
        });
        describe('Should Throw', () => {
            it('is not nullable and not provided', () => {
                assertThrows('object', null);
            });
            it('is not an object', () => {
                assertThrows('object', []);
                assertThrows('object', 1);
                assertThrows('object', 'string');
            });
        });
    });
});
