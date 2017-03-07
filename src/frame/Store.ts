import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import { storePool } from "./StorePool";
import * as Dispatcher from "./Dispatcher";

const initialState = Observable.from([{
  title: "YOLO"
}]);


export class Store {
  protected _dispatcher: any;
  protected _state: any = {};

  private _CLASSNAME: string;
  private _OBSERVERNAME: string;

  constructor() {
    this._CLASSNAME = this.constructor.toString().match(/\w+/g)[1];
    this._OBSERVERNAME = this._CLASSNAME + "$";
    this[this._OBSERVERNAME] = new BehaviorSubject(this._state);
    this._dispatcher = Dispatcher;
  }

  public setState(state:any){
    this._state = Object.assign(this._state,state);
    this[this._OBSERVERNAME].next(this._state);
  }

}

export default Observable.combineLatest(initialState,storePool._store.flatMap(_=>{
  return Observable.from(_);
}),
                                        (...stores:any[]) => {
                                          let r = Object.assign({}, ...stores);
                                          return r;
                                        });
