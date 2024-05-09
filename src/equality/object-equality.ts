import {AnyObject} from '../../node_modules/@augment-vir/common/dist/types/index';
import {AssertionError} from '../assertion.error';
import {isStrictEqual} from './simple-equal';

/** Checks if the given objects' property values are strictly equal to each other. */
export function arePropsStrictEqual(a: AnyObject, b: AnyObject): boolean {
    const allKeys = Array.from(
        new Set([
            ...Object.keys(a),
            ...Object.keys(b),
        ]),
    );

    return allKeys.every((key) => {
        const aValue = a[key];
        const bValue = b[key];

        return isStrictEqual(aValue, bValue);
    });
}

/** Asserts that given objects' property values are strictly equal to each other. */
export function assertPropsStrictEqual(a: AnyObject, b: AnyObject) {
    if (!arePropsStrictEqual(a, b)) {
        throw new AssertionError('Inputs are not strictly equal.');
    }
}
