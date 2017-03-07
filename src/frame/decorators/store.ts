import { Frame } from "../index";
import { storePool } from "../StorePool";
import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "../utils/combineLatestObj";

export default function StoreDecorator(target: any) {

  // save a reference to the original constructor
  var original = target;

  // a utility function to generate instances of a class
  function construct(constructor: any, args: any) {
    var c : any = function () {
      return constructor.apply(this, args);
    }
    c.prototype = constructor.prototype;
    let store = new c();

    let actions:any = {};

    Object.keys(store).forEach((_:any) => {
        if(_[_.length-1] == "$"){
          console.log("act",_);
          actions[_.slice(0, -1)] = store[_]; // must be an observable
        }
    });

    storePool.add(Combine.combineLatestObj(actions));

    return store;
  }

  // the new constructor behaviour
  var f : any = function (...args: any[]) {
    return construct(original, args);
  }

  // copy prototype so intanceof operator still works
  f.prototype = original.prototype;
  // return new constructor (will override original)

  return f;
}
