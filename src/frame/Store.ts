import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Dispatcher from "./Dispatcher";
import * as Combine from "./utils/combineLatestObj";
import { default as StorePool } from "./StorePool";
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
    this[this._OBSERVERNAME] = new BehaviorSubject(this._state);
    this._dispatcher = Dispatcher;
  }

  protected setState(state:any): void{
    this._state = Object.assign(this._state,state);
    this[this._OBSERVERNAME].next(this._state);
  }

  public getStream(): Observable<any> {
    // LALALALLA
    let actionType = eval('class '+this._CLASSNAME.replace('Store','')+'{}');
    let actions = {};
    Object.keys(this).forEach((_:any) => {
        if(_[_.length-1] == "$" && _.slice(0, -1) !== this._CLASSNAME){
          actions[_.slice(0, -1)] = this[_]; // must be an observable
        }
    });
    return Combine.combineLatestObj<typeof actionType>(actionType,actions);
  }
}

class ReduxDevTools {
  static readonly ID = "__REDUX_DEVTOOLS_EXTENSION__";
  private _connection: any = null;
  private _observer: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(){
    this._connection = window[ReduxDevTools.ID].connect({});
    this._connection.init(this._observer.value);
    this._connection.subscribe(this.handleMessage.bind(this));
  }

  private checkExtension(): void {
    //
  }

  private handleMessage(message:any): void {
    if (message.type === 'DISPATCH' && message.state && message.payload.type != "TOGGLE_ACTION") {
      console.log('DevTools requested to change the state to', JSON.parse(message.state));
      let state = JSON.parse(message.state);
      state.payload = message.payload;
      this._observer.next(state);
    }
  }

  public send(describer: string, message:any) {
    this._connection.send(describer, message);
  }

  get observer(): BehaviorSubject<any> {
    return this._observer;
  }
}


let devTools = new ReduxDevTools();
StorePool.register(initialState);

export default Observable.combineLatest(
    StorePool.pool,
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
