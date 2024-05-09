import {
    JsonCompatibleValue,
    extractErrorMessage,
    getObjectTypedKeys,
    hasKey,
    isObject,
    wrapInTry,
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
 * @throws `JsonStringifyError` if the inputs fail when passed to `JSON.stringify`.
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
            const aKeys = Object.keys(a).sort();
            const bKeys = Object.keys(b).sort();

            if (aKeys.length || bKeys.length) {
                const areKeysEqual = baseAreJsonEqual(aKeys, bKeys);

                if (!areKeysEqual) {
                    return false;
                }

                return getObjectTypedKeys(a).every((keyName) => {
                    return isJsonEqual(a[keyName as any], b[keyName as any]);
                });
            }
        }

        return baseAreJsonEqual(a, b);
    } catch (caught) {
        throw new JsonStringifyError(extractErrorMessage(caught));
    }
}

/**
 * Asserts that the inputs are equal via `JSON.stringify` (property order on objects does not
 * matter).
 *
 * @throws `JsonStringifyError` if the inputs fail when passed to `JSON.stringify`.
 * @throws `AssertionError` if the assertion fails.
 */
export function assertJsonEqual(
    a: Readonly<JsonCompatibleValue | undefined>,
    b: Readonly<JsonCompatibleValue | undefined>,
) {
    if (!isJsonEqual(a, b)) {
        throw new AssertionError('Inputs are not JSON equal.');
    }
}

/**
 * Checks for equality between inputs with JSON but ignores top-level properties that are not
 * serializable.
 *
 * @throws Nothing: always returns a boolean.
 */
export function isLooseJsonEqual(a: unknown, b: unknown): boolean {
    try {
        if (isObject(a) && isObject(b)) {
            const allKeys = new Set<PropertyKey>([
                ...getObjectTypedKeys(a),
                ...getObjectTypedKeys(b),
            ]);

            console.log(allKeys.size);

            if (allKeys.size) {
                return Array.from(allKeys).every((key) => {
                    if (!hasKey(a, key) || !hasKey(b, key)) {
                        return false;
                    }

                    const aValue = a[key];
                    const bValue = b[key];

                    if (typeof aValue !== typeof bValue) {
                        return false;
                    }

                    return wrapInTry(() => isJsonEqual(aValue, bValue), {fallbackValue: true});
                });
            }
        }

        return wrapInTry(() => isJsonEqual(a as any, b as any), {fallbackValue: false});
    } catch (error) {
        return false;
    }
}

/**
 * Asserts that the inputs are equal via `JSON.stringify` (property order on objects does not
 * matter).
 *
 * @throws `AssertionError` if the assertion fails.
 */
export function assertLooseJsonEqual(a: unknown, b: unknown) {
    if (!isLooseJsonEqual(a, b)) {
        throw new AssertionError('Inputs are not loosely JSON equal.');
    }
}
