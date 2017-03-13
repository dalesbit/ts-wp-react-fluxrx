import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import { storePool } from "./StorePool";
import * as Dispatcher from "./Dispatcher";
import * as Combine from "./utils/combineLatestObj";
const initialState = Observable.from([{
  title: "YOLO"
}]);

export class Store {
  protected _dispatcher: any;
  protected _state: any = {};
  public _stateProps: any = {};
  private _CLASSNAME: string;
  private _OBSERVERNAME: string;

  constructor() {
    this._CLASSNAME = this.constructor.toString().match(/\w+/g)[1];
    this._OBSERVERNAME = this._CLASSNAME + "$";
    this[this._OBSERVERNAME]:BehaviorSubject = new BehaviorSubject(this._state);
    this._dispatcher = Dispatcher;
  }

  protected setState(state:any){
    this._state = Object.assign(this._state,state);

    this[this._OBSERVERNAME].next(this._state);
  }

  public getStream(){
    function create<T>(c: {new(): T; }): T {
        return new c();
    }
    // LALALALLA
    let m = eval('class '+this._CLASSNAME.replace('Store','')+'{}');
    let actions = {};
    Object.keys(this).forEach((_:any) => {
        if(_[_.length-1] == "$" && _.slice(0, -1) !== this._CLASSNAME){
          actions[_.slice(0, -1)] = this[_]; // must be an observable
        }
    });
    return Combine.combineLatestObj<typeof m>(m,actions);

  }

}

const devToolsObservable = new BehaviorSubject({});
const devTools = window['__REDUX_DEVTOOLS_EXTENSION__'].connect({});
devTools.subscribe((message:any) => {
  if (message.type === 'DISPATCH' && message.state && message.payload.type != "TOGGLE_ACTION") {
    console.log('DevTools requested to change the state to', JSON.parse(message.state));
    devToolsObservable.next(JSON.parse(message.state));
  }
});

devTools.init(devToolsObservable.value);


storePool.add(initialState);
storePool.add(devToolsObservable);
// each time pool emits, then we combine?
let state = null;
export default Observable.combineLatest(
    storePool._pool,
    (...stores:any[]) => {

      let states = {};
      for(let store of stores){
        let m = store.constructor.name !== "Object" ? store.constructor.name : null;
        if(m){
          Object.assign(states, {[m]:store});
        } else {
          Object.assign(states, store);
        }
      }

      devTools.send('change state', states);
      return states;
    });
