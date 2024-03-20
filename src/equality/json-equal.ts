import {
    JsonCompatibleValue,
    extractErrorMessage,
    getObjectTypedKeys,
    isObject,
} from '@augment-vir/common';
import {AssertionError} from '../assertion.error';

/**
 * An error that is thrown from isJsonEqual or assertJsonEqual if the inputs fail on
 * `JSON.stringify`.
 */
export class JsonStringifyError extends Error {
    public override name = 'JsonStringifyError';

    constructor(message: string) {
        super(`Failed to compare objects using JSON.stringify: ${message}`);
    }
}

function baseAreJsonEqual(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Check if the inputs are equal via `JSON.stringify` (property order on objects does not matter).
 *
 * @throws JsonStringifyError if the inputs fail when passed to `JSON.stringify`.
 */
export function isJsonEqual(
    a: Readonly<JsonCompatibleValue | undefined>,
    b: Readonly<JsonCompatibleValue | undefined>,
): boolean {
    try {
        if (a === b || baseAreJsonEqual(a, b)) {
            return true;
        }

        if (isObject(a) && isObject(b)) {
            const areKeysEqual = baseAreJsonEqual(Object.keys(a).sort(), Object.keys(b).sort());

            if (!areKeysEqual) {
                return false;
            }

            return getObjectTypedKeys(a).every((keyName) => {
                return isJsonEqual(a[keyName as any], b[keyName as any]);
            });
        } else {
            return baseAreJsonEqual(a, b);
        }
    } catch (caught) {
        throw new JsonStringifyError(extractErrorMessage(caught));
    }
}

/**
 * Asserts that the inputs are equal via `JSON.stringify` (property order on objects does not
 * matter).
 *
 * @throws JsonStringifyError if the inputs fail when passed to `JSON.stringify`.
 * @throws AssertionError if the assertion fails.
 */
export function assertJsonEqual(
    a: Readonly<JsonCompatibleValue | undefined>,
    b: Readonly<JsonCompatibleValue | undefined>,
) {
    if (!isJsonEqual(a, b)) {
        throw new AssertionError('Inputs are not JSON equal.');
    }
}
