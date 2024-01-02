import {SetRequired} from 'type-fest';

type ExtractValue<
    KeyGeneric extends PropertyKey,
    ParentGeneric,
> = KeyGeneric extends keyof ParentGeneric
    ? SetRequired<ParentGeneric, KeyGeneric>[KeyGeneric]
    : KeyGeneric extends keyof Extract<ParentGeneric, Record<KeyGeneric, any>>
      ? SetRequired<Extract<ParentGeneric, Record<KeyGeneric, any>>, KeyGeneric>[KeyGeneric]
      : never;

type CombinedParentValue<KeyGeneric extends PropertyKey, ParentGeneric> = ExtractValue<
    KeyGeneric,
    ParentGeneric
> extends never
    ? unknown
    : ExtractValue<KeyGeneric, ParentGeneric>;

type CombineTypeWithKey<KeyGeneric extends PropertyKey, ParentGeneric> = ParentGeneric &
    Record<KeyGeneric, CombinedParentValue<KeyGeneric, ParentGeneric>>;

const hasPropertyAttempts: ReadonlyArray<(object: object, key: PropertyKey) => boolean> = [
    (object, key) => {
        return key in object;
    },
    (object, key) => {
        /** This handles cases where the input object can't use `in` directly, like string literals */
        return key in object.constructor.prototype;
    },
];

/** Check if an object has the given property. */
export function hasProperty<KeyGeneric extends PropertyKey, ParentGeneric>(
    inputObject: ParentGeneric,
    property: KeyGeneric,
): inputObject is CombineTypeWithKey<KeyGeneric, ParentGeneric> {
    if (!inputObject) {
        return false;
    }
    return hasPropertyAttempts.some((attemptCallback) => {
        try {
            return attemptCallback(inputObject, property);
        } catch (error) {
            return false;
        }
    });
}

/** Check if an object has all the given properties. */
export function hasProperties<KeyGeneric extends PropertyKey, ParentGeneric>(
    inputObject: ParentGeneric,
    inputKeys: ReadonlyArray<KeyGeneric>,
): inputObject is CombineTypeWithKey<KeyGeneric, ParentGeneric> {
    return inputObject && inputKeys.every((key) => hasProperty(inputObject, key));
}

/**
 * Checks if the given property exists in the given object. This is distinct from `hasProperty`
 * because it type guards the property rather than the object.
 */
export function isPropertyOf<ParentType>(
    property: PropertyKey,
    inputObject: ParentType,
): property is keyof ParentType {
    return hasProperty(inputObject, property);
}
