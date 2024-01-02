import {assert} from '@open-wc/testing';
import {Primitive} from 'type-fest';
import {isPrimitive} from './is-primitive';

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
