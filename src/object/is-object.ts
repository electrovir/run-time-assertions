/**
 * Checks if the input is non-null and some kind of object (including arrays). To exclude arrays,
 * use `isRunTimeType(input, 'object')` instead.
 */
export function isSomeObject(input: any): input is NonNullable<object> {
    return !!input && typeof input === 'object';
}
