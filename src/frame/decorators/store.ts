import { Frame } from "../index";
import { default as storeRegistry } from "../StoreRegistry";
import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "../utils/combineLatestObj";

function expose(prop: string, target: any, key: string) {
    if (!target[prop]) {
        target[prop] = {};
    }
    target[prop][key] = 1;
}

export function Action(target: any, key: string) {
    expose('_actions', target, key);
}

export function Property(target: any, key: string) {
    expose('_props', target, key);
}

export default function StoreDecorator(target: any) {

    // save a reference to the original constructor
    let original = target;

    // a utility function to generate instances of a class
    function construct(constructor: any, args: any) {
        let c: any = function() {
            return constructor.apply(this, args);
        }
        c.prototype = constructor.prototype;
        let store = new c();
        storeRegistry.register(store.getStream());
        return store;
    }

    // the new constructor behaviour
    let f: any = function(...args: any[]) {
        return construct(original, args);
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;
    // return new constructor (will override original)

    return f;
}
