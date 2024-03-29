import {itCases} from '@augment-vir/browser-testing';
import {JsonCompatibleObject, JsonCompatibleValue} from '@augment-vir/common';
import {assertThrows} from './assert-throws';
import {assertTypeOf} from './assert-type-of';
import {AssertionError} from './assertion.error';
import {RunTimeType, RunTimeTypeMapping, assertRunTimeType, isRunTimeType} from './run-time-types';

describe('RunTimeTypeMapping', () => {
    it('has all RunTimeType options as keys', () => {
        assertTypeOf<keyof RunTimeTypeMapping>().toEqualTypeOf<RunTimeType>();
    });
});

describe(isRunTimeType.name, () => {
    it('should narrow a union type', () => {
        const possiblyNumber = 42 as number | number[];

        if (isRunTimeType(possiblyNumber, 'array')) {
            assertTypeOf(possiblyNumber).toEqualTypeOf<number[]>();
        }
    });

    it('should narrow an any type', () => {
        const anything = {} as any;

        if (isRunTimeType(anything, 'bigint')) {
            assertTypeOf(anything).toEqualTypeOf<bigint>();
        }
    });

    it('should narrow a union', () => {
        const anything = {} as string | object;

        if (isRunTimeType(anything, 'string')) {
            assertTypeOf(anything).toEqualTypeOf<string>();
        }
    });

    it('should narrow out array types in the object type', () => {
        const anything = {} as JsonCompatibleValue;

        assertTypeOf<JsonCompatibleObject>().toMatchTypeOf(anything);
        assertTypeOf(anything).not.toMatchTypeOf<JsonCompatibleObject>();

        if (isRunTimeType(anything, 'object')) {
            assertTypeOf(anything).toMatchTypeOf<JsonCompatibleObject>();
        }
    });

    itCases(isRunTimeType, [
        {
            it: 'should distinguish array independent of object',
            inputs: [
                [],
                'array',
            ],
            expect: true,
        },
        {
            it: 'should detect a normal object still',
            inputs: [
                {},
                'object',
            ],
            expect: true,
        },
    ]);
});

describe(assertRunTimeType.name, () => {
    it('narrows types', () => {
        const example = 'test thing' as unknown;

        assertTypeOf(example).not.toEqualTypeOf<string>();
        assertRunTimeType(example, 'string');
        assertTypeOf(example).toEqualTypeOf<string>();
    });

    it('throws an error if the assertion fails', () => {
        assertThrows(() => assertRunTimeType([], 'string', 'is not a string'), {
            matchConstructor: AssertionError,
            matchMessage: 'is not a string',
        });
    });
    it('throws default message', () => {
        assertThrows(() => assertRunTimeType([], 'string'), {
            matchConstructor: AssertionError,
            matchMessage: "value is of type 'array' but type 'string' was expected.",
        });
    });
});
