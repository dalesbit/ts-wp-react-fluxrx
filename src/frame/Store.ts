import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Dispatcher from "./Dispatcher";
import * as Combine from "./utils/combineLatestObj";
import { default as storeRegistry } from "./StoreRegistry";

const initialState = Observable.of({
  title: "YOLO"
});

export class Store {

  protected _dispatcher: any;
  protected _state: any = {};
  protected _actions: any = {};
  protected _props: any = {};
  protected _CLASSNAME: string;


  constructor() {
    this._CLASSNAME = this.constructor.toString().match(/\w+/g)[1];
    this._dispatcher = Dispatcher;
  }

  protected setState(state:any): void{
    this._state = Object.assign(this._state,state);
  }

  public getStream(): Observable<any> {
    // LALALALLA
    let actionType = eval('class '+this._CLASSNAME.replace('Store','')+'{}');

    return Combine.combineLatestObj<typeof actionType>(
      actionType,
      Object.keys(
        Object.assign(this.constructor.prototype._props,this.constructor.prototype._actions)
      )
        .map((key:string) => {
            return Object.assign({},{[key]:this[key]});
        })
        .reduce((last:any,current:any,key:number) => {
          return Object.assign(last,current);
        })
    );

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

  private handleMessage(message:any): void {
    if (message.type === 'DISPATCH' && message.state && message.payload.type != "TOGGLE_ACTION") {
      console.log('DevTools requested to change the state to', JSON.parse(message.state));
      this._observer.next(JSON.parse(message.state));
    }
  }

  public send(describer: string, message:any): void {
    this._connection.send(describer, message);
  }

  get observer(): BehaviorSubject<any> {
    return this._observer;
  }
}


let devTools = new ReduxDevTools();
storeRegistry.register(initialState);

export default Observable.combineLatest(
    storeRegistry.pool,
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
