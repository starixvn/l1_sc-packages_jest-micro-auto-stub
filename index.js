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

function stubMongooseModel(base = {}) {
    if (!(base instanceof mongoose.Model)) {
        throw new Error("Expected mongoose.Model");
    }

    const store = new Map();

    return new Proxy(base, {
        get(target, prop) {
            if (prop in target && !store.has(prop)) {
                const mockedFunction = prop.startsWith("find")
                    ? jest.fn().mockReturnValueOnce({ lean: jest.fn().mockReturnValueOnce({ exec: jest.fn() }) })
                    : jest.fn();

                store.set(prop, mockedFunction);
            }

            return store.get(prop);
        },
        has(_target, prop) {
            return store.has(prop);
        },
    });
}

export { stub, stubMongooseModel };
