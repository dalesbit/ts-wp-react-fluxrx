import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "./utils/combineLatestObj";

export interface Registry {
    register(item: any): boolean | number;
    exists(item: any): boolean;
    remove(item: any): void;
    get(key: number): any | boolean;
    getKey(item: any): number;
    flush(): void;
    size: number;
    keys: Iterator<any>;
    pool: any;
}

export class StoreRegistry implements Registry {

    private _pool: Array<any> = [];

    public register(store: any): boolean | number {
        if (!this.exists(store)) { return false };
        return this._pool.push(store);
    }

    public exists(item: any): boolean {
        return this.getKey(item) === -1;
    }

    public getKey(item: any): number {
        return this._pool.indexOf(item);
    }

    public get(key: number): any | boolean {
        return this.exists(this._pool[key]) ? this._pool[key] : false;
    }

    public remove(item: any): void {
        this._pool.splice(this.getKey(item));
    }

    public flush(): void {
        while (this._pool.length > 0) {
            this._pool.pop();
        }
    }

    get size(): number {
        return this._pool.length;
    }

    get keys(): Iterator<any> {
        return this._pool.keys();
    }

    get pool(): Array<any> {
        return this._pool;
    }

}

var storeRegistry = new StoreRegistry();
export default storeRegistry;
