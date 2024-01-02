import {Primitive} from 'type-fest';

/** Checks if the given value is a primitive or not. */
export function isPrimitive(value: unknown): value is Primitive {
    /**
     * `null` is a primitive but `typeof null` gives `'object'` so we have to special case `null`
     * here.
     */
    if (value === null) {
        return true;
    }

    return typeof value !== 'object' && typeof value !== 'function';
}
