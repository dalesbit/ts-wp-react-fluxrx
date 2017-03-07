import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "./utils/combineLatestObj";

export class StorePool {
  private _pool: any = {
    pool: Observable.from([1])
  };
  private i = 0;
  public tb = [];
  public _ct: any = new BehaviorSubject();
  public _store: BehaviorSubject = new BehaviorSubject();

  constructor(){
  }

  public add(store:any): void {
    this._store.next(store);
  }

  get pool() {
    return this._pool;
  }

}

export var storePool = new StorePool();

export default storePool._ct;
