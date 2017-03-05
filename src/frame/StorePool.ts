import { BehaviorSubject, Observable } from '@reactivex/rxjs';

export class StorePool {
  private _pool: Array<any> = new Array<any>();

  constructor(){}

  public add(store: Observable<any>): void {
    this._pool.push(store);
    
  }

  get pool(): Array<any> {
    return this._pool;
  }

}

export var storePool = new StorePool();

export default storePool.pool;
