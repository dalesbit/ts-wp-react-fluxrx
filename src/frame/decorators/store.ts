import { Frame } from "../index";
import { storePool } from "../StorePool";
import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "../utils/combineLatestObj";

function expose(prop: string, target: any, key: string){
  if(!target[prop]){
    target[prop] = {};
  }
  target[prop][key] = 1;
}

export function Stream(target: any, key: string){
  let c = target[key];
/*
  // property value
  target[key] = new BehaviorSubject(target[key]);
  // property getter
  var getter = function () {
    console.log(`Get: ${key} => ${target[key].value}`);

    return target[key].value;
  };

  // property setter
  var setter = function (newVal:any) {
    console.log(`Set: ${key} => ${newVal}`);
    debugger;
    target[key].next(newVal);
  };

  // Delete property.
  if (delete target[key]) {

    // Create new property with getter and setter
    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  }
  debugger;*/
}

export function Obs(target: any, key: string){
  expose('_stateObs',target,key);
}

export function State(target: any, key: string){
  expose('_stateProps',target,key);
}

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

    /* fill state with decorated props */
    /*Object.keys(c.prototype._stateObs).forEach((_:any) => {
        c.prototype._stateObs[_] = Observable.of(store[_]);
        store[_] = null;
        //delete store[_];
    });
    actions = Object.assign(actions,c.prototype._stateObs);



    Object.keys(c.prototype._stateProps).forEach((_:any) => {
        c.prototype._stateProps[_] = store[_];
        store[_] = null;
        //delete store[_];
    });
    */


    //store.setState(Object.assign(store._state,c.prototype._stateProps));
    /* end fill */

    /* expose actions defined on the store */


    // so lets create a namespace wrapper

    storePool.add(store.getStream());
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
