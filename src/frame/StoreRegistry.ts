import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "./utils/combineLatestObj";

export interface Registry {
  register(item:any): boolean;
  exists(item:any): boolean;
  remove(item:any): void;
  flush(): void;
  size: number;
  keys: any;
  pool: any;
}

export class StoreRegistry implements Registry {

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
    while(this._pool.length > 0) {
      this._pool.pop();
    }
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

var storeRegistry = new StoreRegistry();
export default storeRegistry;
