import {getObjectTypedKeys} from '@augment-vir/common';
import {PartialDeep} from 'type-fest';
import {isInstanceOf} from '../assertions';
import {isRunTimeType} from '../run-time-types';

/**
 * Extract all nested object keys and values that are different between the two given objects.
 *
 * @returns An empty tuple if the values are equal.
 */
export function diffObjects<
    T0 extends Readonly<Record<PropertyKey, unknown>>,
    T1 extends Readonly<Record<PropertyKey, unknown>>,
>(object0: T0, object1: T1): [PartialDeep<T0>, PartialDeep<T1>] | [] {
    const allObjectKeys = Array.from(
        new Set([
            ...getObjectTypedKeys(object0),
            ...getObjectTypedKeys(object1),
        ]),
    );

    const diffOutput = allObjectKeys.reduce(
        (accum, objectKey) => {
            const value0 = object0[objectKey];
            const value1 = object1[objectKey];

            const diffOutput = diffValues(value0, value1);

            if (!diffOutput.length) {
                return accum;
            }

            if (!(objectKey in object0)) {
                accum[1][objectKey] = diffOutput[1];
            } else if (!(objectKey in object1)) {
                accum[0][objectKey] = diffOutput[0];
            } else {
                accum[0][objectKey] = diffOutput[0];
                accum[1][objectKey] = diffOutput[1];
            }

            return accum;
        },
        [
            {},
            {},
        ] as [Record<PropertyKey, unknown>, Record<PropertyKey, unknown>],
    );

    if (!Object.keys(diffOutput[0]).length && !Object.keys(diffOutput[1]).length) {
        return [];
    } else {
        return diffOutput as [PartialDeep<T0>, PartialDeep<T1>];
    }
}

/**
 * Extract all entries in the given arrays that are not equal.
 *
 * @returns An empty tuple if the values are equal.
 */
export function diffArrays<T0, T1>(
    array0: ReadonlyArray<T0>,
    array1: ReadonlyArray<T1>,
): [Array<T0>, Array<T1>] | [] {
    const allArrayIndexes: ReadonlyArray<number> = Array.from(
        new Set(
            [
                ...Object.keys(array0),
                ...Object.keys(array1),
            ].map((index) => Number(index)),
        ),
    );

    const diffArrays = allArrayIndexes.reduce(
        (accum, arrayIndex) => {
            const value0 = array0[arrayIndex]!;
            const value1 = array1[arrayIndex]!;

            const diffOutput = diffValues(value0, value1);

            if (!diffOutput.length) {
                return accum;
            }

            if (!(arrayIndex in array0)) {
                accum[1][arrayIndex] = diffOutput[1];
            } else if (!(arrayIndex in array1)) {
                accum[0][arrayIndex] = diffOutput[0];
            } else {
                accum[0][arrayIndex] = diffOutput[0];
                accum[1][arrayIndex] = diffOutput[1];
            }

            return accum;
        },
        [
            [],
            [],
        ] as [Array<T0>, Array<T1>],
    );

    if (!diffArrays[0].length && !diffArrays[1].length) {
        return [];
    } else {
        return diffArrays;
    }
}

/** Callback for checking equality between two values that can be of different types. */
export type AreEqualCallback<T0, T1> = (value0: T0, value1: T1) => boolean;

/**
 * Simple diff check that is useful simply to return the same format as the other diff functions.
 *
 * @returns An empty tuple if the values are equal.
 */
export function diffBasic<T0, T1>(
    value0: T0,
    value1: T1,
    /** A custom equality checker. Defaults to a strict equality check (`===`). */
    areEqual: AreEqualCallback<T0, T1> = (value0, value1) =>
        (value0 as unknown) === (value1 as unknown),
): [T0, T1] | [] {
    if (areEqual(value0, value1)) {
        return [];
    } else {
        return [
            value0,
            value1,
        ];
    }
}

const orderedValueDiffs: ReadonlyArray<
    (value0: unknown, value1: unknown) => undefined | [] | [unknown, unknown]
> = [
    (value0, value1) => {
        if (!isRunTimeType(value0, 'array') || !isRunTimeType(value1, 'array')) {
            return undefined;
        }
        return diffArrays(value0, value1);
    },
    (value0, value1) => {
        if (!isInstanceOf(value0, RegExp) || !isInstanceOf(value1, RegExp)) {
            return undefined;
        }
        /** Special case RegExps because they should be checked for equality as strings. */
        return diffBasic(value0, value1, (a, b) => String(a) === String(b));
    },
    (value0, value1) => {
        if (!isRunTimeType(value0, 'object') || !isRunTimeType(value1, 'object')) {
            return undefined;
        }
        return diffObjects(value0, value1);
    },
];

/**
 * Diff any values. For diffing objects, use `diffObjects` to get better types.
 *
 * @returns An empty tuple if the values are equal.
 */
export function diffValues<T0, T1>(value0: T0, value1: T1): [T0, T1] | [] {
    let diffOutput = undefined as [] | [unknown, unknown] | undefined;
    orderedValueDiffs.some((differ) => {
        diffOutput = differ(value0, value1);
        return !!diffOutput;
    });

    if (diffOutput) {
        return diffOutput as [T0, T1] | [];
    }

    /** Fallback to the basic diff. */
    return diffBasic(value0, value1) as [T0, T1] | [];
}
