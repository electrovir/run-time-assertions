import {AnyObject, isObject} from '@augment-vir/common';
import {AssertionError} from '../assertion.error';
import {isStrictEqual} from './simple-equal';

/**
 * Checks if the input's object property values are strictly equal to each other. If the inputs are
 * not objects, perform the strict equality check on them directly.
 */
export function arePropsStrictEqual(a: unknown, b: unknown): boolean {
    if (isObject(a) && isObject(b)) {
        const allKeys = Array.from(
            new Set([
                ...Object.keys(a),
                ...Object.keys(b),
            ]),
        );

        return allKeys.every((key) => {
            const aValue = (a as AnyObject)[key];
            const bValue = (b as AnyObject)[key];

            return isStrictEqual(aValue, bValue);
        });
    } else {
        return isStrictEqual(a, b);
    }
}

/**
 * Asserts that given objects' property values are strictly equal to each other using
 * `arePropsStrictEqual`.
 */
export function assertPropsStrictEqual(a: AnyObject, b: AnyObject) {
    if (!arePropsStrictEqual(a, b)) {
        throw new AssertionError('Inputs are not strictly equal.');
    }
}
