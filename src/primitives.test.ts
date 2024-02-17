import {FunctionTestCase, itCases} from '@augment-vir/browser-testing';
import {randomString} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {Primitive} from 'type-fest';
import {assertThrows} from './assert-throws';
import {assertIsPrimitive, assertIsPropertyKey, isPrimitive, isPropertyKey} from './primitives';

const primitives: ReadonlyArray<Primitive> = [
    'string',
    123,
    123n,
    true,
    false,
    undefined,
    Symbol('symbol'),
    null,
];

const nonPrimitives: ReadonlyArray<unknown> = [
    {},
    () => {},
    [],
];

describe(isPrimitive.name, () => {
    it('is true for all primitive types', () => {
        primitives.forEach((primitive, index) => {
            assert.isTrue(
                isPrimitive(primitive),
                `'${String(primitive)}' (index '${index}') is a primitive`,
            );
        });
    });

    it('is false for non-primitive types', () => {
        nonPrimitives.forEach((nonPrimitive, index) => {
            assert.isFalse(
                isPrimitive(nonPrimitive),
                `'${String(nonPrimitive)}' (index '${index}') is not a primitive`,
            );
        });
    });
});

describe(assertIsPrimitive.name, () => {
    it('is true for all primitive types', () => {
        primitives.forEach((primitive, index) => {
            assertIsPrimitive(
                primitive,
                `'${String(primitive)}' (index '${index}') is a primitive`,
            );
        });
    });

    it('is false for non-primitive types', () => {
        nonPrimitives.forEach((nonPrimitive, index) => {
            assertThrows(
                () => assertIsPrimitive(nonPrimitive),
                undefined,
                `'${String(nonPrimitive)}' (index '${index}') is not a primitive`,
            );
        });
    });
});

const propertyKeyTestCases = [
    {
        it: 'accepts a string',
        input: 'hi',
        expect: true,
    },
    {
        it: 'accepts a number',
        input: 0,
        expect: true,
    },
    {
        it: 'accepts a symbol',
        input: Symbol('hello'),
        expect: true,
    },
    {
        it: 'rejects a function',
        input: () => {},
        expect: false,
    },
    {
        it: 'rejects a boolean',
        input: true,
        expect: false,
    },
    {
        it: 'rejects an object',
        input: {},
        expect: false,
    },
    {
        it: 'rejects an array',
        input: [],
        expect: false,
    },
    {
        it: 'rejects a bigint',
        input: 123n,
        expect: false,
    },
    {
        it: 'rejects undefined',
        input: undefined,
        expect: false,
    },
    {
        it: 'rejects null',
        input: null,
        expect: false,
    },
] as const satisfies ReadonlyArray<FunctionTestCase<typeof isPropertyKey>>;

describe(isPropertyKey.name, () => {
    itCases(isPropertyKey, propertyKeyTestCases);
});

describe(assertIsPropertyKey.name, () => {
    itCases(
        assertIsPropertyKey,
        propertyKeyTestCases.map((testCase): FunctionTestCase<typeof assertIsPropertyKey> => {
            const errorMessage = randomString();
            return {
                it: testCase.it,
                inputs: [
                    testCase.input,
                    errorMessage,
                ],
                throws: testCase.expect ? undefined : errorMessage,
            };
        }),
    );
});
