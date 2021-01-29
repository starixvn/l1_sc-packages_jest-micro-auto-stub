function stub(base = {}) {
    const store = new Map();

    return new Proxy(base, {
        get(target, prop) {
            if (prop in target) {
                return target[prop];
            }

            if (prop === "then") {
                return undefined;
            }

            if (!store.has(prop)) {
                store.set(prop, jest.fn());
            }

            return store.get(prop);
        },
        has(target, prop) {
            if (prop in target) {
                return true;
            }

            if (prop === "then") {
                return false;
            }

            return store.has(prop);
        },
    });
}

function stubMongooseModelStupidly(base = {}) {
    const store = new Map();

    return new Proxy(base, {
        get(target, prop) {
            if (prop in target && !store.has(prop)) {
                const mockedExecFunction = jest.fn();
                const mockedFindFunction = { lean: () => ({ exec: mockedExecFunction }) };
                const mockedFunction = prop.startsWith("find") ? () => mockedFindFunction : jest.fn();

                store.set(prop, mockedFunction);
            }

            return store.get(prop);
        },
        has(_target, prop) {
            return store.has(prop);
        },
    });
}

module.exports = { stub, stubMongooseModelStupidly };
