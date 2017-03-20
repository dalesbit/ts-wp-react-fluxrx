import { mapTo } from '@reactivex/rxjs/dist/cjs/operator/mapTo';
import { Action, Property, Store, Reduce } from '../frame/decorators';
import { StoreManager } from '../frame/Store';
import { Observable } from '@reactivex/rxjs';

@Store
export class AppStore extends StoreManager {

    // post defined reducer

    @Reduce("COUNTER_INCREASED2")
    inc(state: Observable<any>) {
        return state.mapTo(2).do(() => {
            console.warn("LAS");
        });
    };

    // constant reducing
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
