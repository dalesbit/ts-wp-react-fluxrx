import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Dispatcher from "./Dispatcher";
import * as Combine from "./utils/combineLatestObj";
import { default as storeRegistry } from "./StoreRegistry";
import { ReduxDevTools } from "./ReduxDevTools";

export class StoreManager {

    protected _dispatcher: any;
    protected _state: any = {};
    protected _actions: any = {};
    protected _props: any = {};
    protected _CLASSNAME: string;


    constructor() {
        this._CLASSNAME = this.constructor.toString().match(/\w+/g)[1];
        this._dispatcher = Dispatcher;
    }

    protected setState(state: any): void {
        this._state = Object.assign(this._state, state);
    }

    public getStream(): Observable<any> {
        // LALALALLA
        let actionType = eval('class ' + this._CLASSNAME.replace('Store', '') + '{}');

        return Combine.combineLatestObj<typeof actionType>(
            actionType,
            Object.keys(
                Object.assign(this.constructor.prototype._props, this.constructor.prototype._actions)
            )
                .map((key: string) => {
                    return Object.assign({}, {
                        [key]: this[key] // tslint:disable-line
                    });
                })
                .reduce((last: any, current: any, key: number) => {
                    return Object.assign(last, current);
                })
        );

    }
}


const devTools = new ReduxDevTools();
const initialState = Observable.of({
    title: "YOLO"
});
storeRegistry.register(devTools.observer); // not working ATM
storeRegistry.register(initialState);

export default Observable.combineLatest(
    storeRegistry.pool,
    (...stores: any[]) => {
        let states = {};
        for (let store of stores) {
            let m = store.constructor.name !== "Object" ? store.constructor.name : null;
            if (m) {
                Object.assign(states, { [m]: store });
            } else {
                Object.assign(states, store);
            }
        }
        devTools.send('change state', states);
        return states;
    });
