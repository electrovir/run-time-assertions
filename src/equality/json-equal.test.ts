import {itCases} from '@augment-vir/browser-testing';
import {assert} from '@open-wc/testing';
import {assertThrows} from '../assert-throws';
import {assertJsonEqual, isJsonEqual, JsonStringifyError} from './json-equal';

describe(isJsonEqual.name, () => {
    it('should pass for different object references', () => {
        const objectA: Record<string, number> = {
            a: 1,
            c: 3,
        };
        const objectB: Readonly<Record<string, number>> = {
            a: 1,
            b: 2,
            c: 3,
        };

        objectA.b = 2;

        assert.isTrue(isJsonEqual(objectA, objectB));
    });

    it('should pass for same object references', () => {
        const objectA: Record<string, number> = {
            a: 1,
            c: 3,
        };

        assert.isTrue(isJsonEqual(objectA, objectA));
    });

    it('should pass for non object inputs', () => {
        assert.isTrue(isJsonEqual('hello', 'hello'));
        assert.isTrue(isJsonEqual(undefined, undefined));
        assert.isFalse(isJsonEqual(undefined, {}));
    });

    it('should not pass if objects are different', () => {
        const objectA: Record<string, number> = {
            a: 1,
            b: 2.1,
            c: 3,
        };
        const objectB: Record<string, number> = {
            a: 1,
            b: 2,
            c: 3,
        };

        assert.isFalse(isJsonEqual(objectA, objectB));
        assert.isTrue(isJsonEqual({...objectA, b: 2}, objectB));
    });

    it('fails with cyclic objects', () => {
        const objectA: Record<string, any> = {
            a: 1,
            b: 2,
        };
        objectA.a = objectA;
        const objectB: Record<string, any> = {
            a: 1,
            b: 2,
        };
        objectB.a = objectB;

        assertThrows(() => isJsonEqual(objectA, objectB), {matchConstructor: JsonStringifyError});
    });

    it("fails on values that JSON.stringify can't handle", () => {
        const objectA: Record<string, any> = {
            a: 1n,
            b: 2,
        };
        const objectB: Record<string, any> = {
            a: 1n,
            b: 2,
        };

        assertThrows(() => isJsonEqual(objectA, objectB), {matchConstructor: JsonStringifyError});
    });

    itCases(isJsonEqual, [
        {
            it: 'passes for nested unordered object keys',
            inputs: [
                {
                    b: {
                        first: 1,
                        second: 2,
                    },
                    a: 'hi',
                },
                {
                    b: {
                        second: 2,
                        first: 1,
                    },
                    a: 'hi',
                },
            ],
            expect: true,
        },
        {
            it: 'ignore non-serializable properties',
            inputs: [
                // @ts-expect-error: document.body is not a JSON compatible value
                {
                    b: {
                        first: 1,
                        second: 2,
                    },
                    a: 'hi',
                    document: document.body,
                },
                // @ts-expect-error: document.body is not a JSON compatible value
                {
                    b: {
                        second: 2,
                        first: 1,
                    },
                    a: 'hi',
                    document: document.body,
                },
            ],
            expect: true,
        },
    ]);
});

describe(assertJsonEqual.name, () => {
    itCases(assertJsonEqual, [
        {
            it: 'throws an error when not equal',
            inputs: [
                {hi: 'bye'},
                {no: 'yes'},
            ],
            throws: Error,
        },
        {
            it: 'does not throw when equal',
            inputs: [
                {hi: 'bye'},
                {hi: 'bye'},
            ],
            throws: undefined,
        },
    ]);
});
