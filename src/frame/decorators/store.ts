import storeRegistry from '../StoreRegistry';
import { actions, props } from './symbols';

const expose = (prop: string, target: any, key: string, value: any | null) => {
    if (!target[prop]) {
        target[prop] = {};
    }
    target[prop][key] = value ? value : 1;
};

export function Reduce(value: string) {
    return (target: any, propertyKey: string, descriptor: any) => {
        expose("_reducers", target, propertyKey, { [value]: target[propertyKey] });
    };

}

export function Action(target: any, key: string) {
    expose(actions, target, key, null);
}

export function Property(target: any, key: string) {
    expose(props, target, key, null);
}

export default function StoreDecorator(target: any) {

    // save a reference to the original constructor
    let original = target;

    // a utility function to generate instances of a class
    function construct(constructor: any, args: any) {
        let c: any = function () {
            return constructor.apply(this, args);
        }
        c.prototype = constructor.prototype;
        let store = new c();
        for (let key in store.constructor.prototype._reducers) {
            let reducer = store.constructor.prototype._reducers[key];
            let name = Object.keys(reducer)[0];
            store[key] = store[key](store._dispatcher.getPayload(name));
            store[key].subscribe(() => { });
        }
        storeRegistry.register(store.getStream());

        return store;
    }

    // the new constructor behaviour
    let f: any = function (...args: any[]) {
        return construct(original, args);
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;
    // return new constructor (will override original)

    return f;
}
