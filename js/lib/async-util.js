/**
 * `Promise.race`, but return the array index of the first promise.
 * - Enables removing the resolved promise from the race iterable.
 *
 * Issue: `Promise.race` does not return the same promise object id (so `===` cannot be used to see which promise is the first in the array).
 *
 * @see https://stackoverflow.com/a/42898229/4949386
 */
const raceWithId = async (a) => {
    return await Promise.race(a.map((p, i) => {
        return p.then(ret => ({i, ret}));
    }));
};

// Waits for the first resolved promise, returns its value, and removes it from the array.
const removeNext = async (a) => {
    const {i, ret} = await raceWithId(a);
    a.slice(i, 1);
    return ret;
};

/**
 * `a` should contain at least one resolved promise.
 */
const getFirstImmediately = async (a, maxWait = 5) => {
    const cp = [...a];

    const t1 = timer(maxWait);

    // Push timer into iterable to use the JS VMs implementation of race.
    cp.push(t1);

    const first = await raceWithId(cp);

    if (cp[first.i] === t1) {
        return null;
    }

    return first;
};

/**
 * Removes and returns the first and only resolved promise from iterable.
 */
const getNextAssertOne = async (a, maxWait = 5) => {
    const f = await getFirstImmediately(a, maxWait);

    if (f === null) {
        console.log({a, maxWait});
        console.warn('Assert failed: expecting at least one immediate promise to be resolved from iterable. None found.');
        return null;
    }

    a.splice(f.i, 1);

    const f2 = await getFirstImmediately(a, maxWait);
    if (f2 !== null) {
        console.warn('Assert failed: expecting no promises to be resolved yet, found at least one.');
        return null;
    }

    return f.ret;
};

const timer = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(null), ms);
    });
};


export {
    timer,
    raceWithId,
    getFirstImmediately,
    getNextAssertOne,
    removeNext,
};
