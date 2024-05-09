import {FunctionTestCase, itCases} from '@augment-vir/browser-testing';
import {ArrayElement, omitObjectKeys} from '@augment-vir/common';
import {AssertionError} from '../assertion.error';
import {assertDeeplyEqual, isDeeplyEqual} from './deep-equal';

const testCases = [
    {
        it: 'passes on primitives',
        inputs: [
            'a',
            'a',
        ],
        expect: true,
    },
    {
        it: 'passes equal dates',
        inputs: [
            new Date(100),
            new Date(100),
        ],
        expect: true,
    },
    {
        it: 'rejects unequal dates',
        inputs: [
            new Date(100),
            new Date(10),
        ],
        expect: false,
    },
] satisfies ReadonlyArray<FunctionTestCase<typeof isDeeplyEqual>>;

describe(isDeeplyEqual.name, () => {
    itCases(isDeeplyEqual, testCases);
});

describe(assertDeeplyEqual.name, () => {
    itCases(
        assertDeeplyEqual,
        testCases.map((testCase) => {
            return {
                ...omitObjectKeys<ArrayElement<typeof testCases>, 'expect'>(testCase, [
                    'expect',
                ]),
                throws: testCase.expect ? undefined : AssertionError,
            };
        }),
    );
});
