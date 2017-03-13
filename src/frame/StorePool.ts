import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "./utils/combineLatestObj";

export default class StorePool {

  public _store: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public _pool: any[] = [];
  constructor(){
  }

  public add(store:any): void {
    // TODO why wrap it again.. ffs
    //this._store.next(store);
    this._pool.push(store);
  }

}

export var storePool = new StorePool();
