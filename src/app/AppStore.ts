import { Property, Store, Action } from "../frame/decorators";
import { StoreManager } from "../frame/Store";
import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "../frame/utils/combineLatestObj";

@Store
export class AppStore extends StoreManager {
    // TODO REDUCE this with a decorator, reducers
    increase = this._dispatcher.getPayload("COUNTER_INCREASED").mapTo(1);
    decrease = this._dispatcher.getPayload("COUNTER_DECREASED").mapTo(-1);


    add(a: any, b: any) {
        return Number(a) + Number(b);
    }

    @Property
    private counter = Observable
        .merge(this.increase, this.decrease)
        .scan(this.add)
        .startWith(0);


    @Action
    public increaseCount = Observable.of(() => {
        this._dispatcher.dispatch("COUNTER_INCREASED")
    });

    @Action
    public decreaseCount = Observable.of(() => {
        this._dispatcher.dispatch("COUNTER_DECREASED")
    });

    constructor() {
        super();
    }

}
