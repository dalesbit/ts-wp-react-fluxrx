import { Frame } from "../index";
import { storePool } from "../StorePool";
import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "../utils/combineLatestObj";

export default function Store(target: any) {

  // save a reference to the original constructor
  var original = target;

  // a utility function to generate instances of a class
  function construct(constructor: any, args: any) {
    var c : any = function () {
      return constructor.apply(this, args);
    }
    c.prototype = constructor.prototype;

    return new c();
  }

  // the new constructor behaviour
  var f : any = function (...args: any[]) {
    return construct(original, args);
  }

  // copy prototype so intanceof operator still works
  f.prototype = original.prototype;
  f.prototype._dispatcher = Frame.Dispatcher;
  storePool.add((() => {
    let actions = {};

    Object.keys(f.prototype).forEach(_ => {
        if(_[_.length-1  ] == "$"){
          actions[_] = f.prototype[_]; // must be an observable
        }
    });
    

    return Combine.combineLatestObj(actions);
  })());

  // return new constructor (will override original)

  return f;
}
