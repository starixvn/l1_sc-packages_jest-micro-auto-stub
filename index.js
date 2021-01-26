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
    return new Proxy(base, {
        get(target, prop) {
            if (prop in target) {
                return prop.startsWith("find")
                    ? jest.fn().mockImplementationOnce(() => ({ lean: jest.fn().mockImplementationOnce(() => ({ exec: jest.fn() })) }))
                    : jest.fn();
            }

            return undefined;
        },
        has(_target, prop) {
            return true;
        },
    });
}

module.exports = { stub, stubMongooseModelStupidly };
