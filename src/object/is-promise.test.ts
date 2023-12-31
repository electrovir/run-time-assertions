import {MaybePromise, wait} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {assertTypeOf} from '../assert-type-of';
import {isPromiseLike} from './is-promise';

describe(isPromiseLike.name, () => {
    it('type guards inputs', () => {
        const maybePromise: MaybePromise<string> = {} as any;

        if (isPromiseLike(maybePromise)) {
            assertTypeOf(maybePromise).toEqualTypeOf<Promise<string>>();
        }
    });

    it('accepts an object with a .then property', () => {
        assert.isTrue(isPromiseLike({then: () => {}}));
    });

    it('works an an actual promise', async () => {
        const waiting = wait(0);
        assert.isTrue(isPromiseLike(waiting));
        const awaited = await waiting;
        assert.isFalse(isPromiseLike(awaited));
    });
});
