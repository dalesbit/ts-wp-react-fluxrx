import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "./utils/combineLatestObj";

export abstract class Pool {
  public register(item:any){};
  public exists(item:any){};
  public remove(item:any){};
  public flush(){};
  size: number;
  keys: any;
  pool: any;
}

export class StorePool extends Pool {

  private _pool: any[] = [];

  public register(store:any): boolean {
    if(!this.exists(store)) return false;

    this._pool.push(store);
    return true;
  }

  public exists(item:any): boolean {
    return this.getKey(item) === -1;
  }

  public getKey(item:any): number {
    return this._pool.indexOf(item);
  }

  public remove(item:any): void {
    this._pool.splice(this.getKey(item));
  }

  public flush(): void {
    this._pool = [];
  }

  get size(): number {
    return this._pool.length;
  }

  get keys(): any {
    return this._pool.keys();
  }

  get pool(): any {
    return this._pool;
  }

}

var storePool = new StorePool();
export default storePool;
