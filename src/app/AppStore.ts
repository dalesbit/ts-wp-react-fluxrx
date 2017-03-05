import { Store } from "../frame/decorators";
import { BehaviorSubject, Observable } from '@reactivex/rxjs';

@Store
export class AppStore extends BehaviorSubject<any> {
  public _dispatcher: any;
  constructor() {
    super(null);
  }

  public add(a:any, b:any) {
    return Number(a) + Number(b);
  }

  public increase = this._dispatcher.getPayload("COUNTER_INCREASED").mapTo(1);

  public decrease = this._dispatcher.getPayload("COUNTER_DECREASED").mapTo(-1);

  public counter = Observable
      .merge(this.increase, this.decrease)
      .scan(this.add)
      .startWith(0);

  public _state = {
    'test':1
  };

  public increaseCount$ = Observable.of(() => {
      this._dispatcher.dispatch("COUNTER_INCREASED")
  });

  public decreaseCount$ = Observable.of(() => {
      this._dispatcher.dispatch("COUNTER_DECREASED")
  });

}
