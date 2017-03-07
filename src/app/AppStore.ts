import { StoreDecorator } from "../frame/decorators";
import { Store } from "../frame/Store";
import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "../frame/utils/combineLatestObj";

@StoreDecorator
export class AppStore extends Store {

  increase = this._dispatcher.getPayload("COUNTER_INCREASED").mapTo(1);
  decrease = this._dispatcher.getPayload("COUNTER_DECREASED").mapTo(-1);

  add(a:any, b:any) {
    return Number(a) + Number(b);
  }

  private count$ = Observable
      .merge(this.increase, this.decrease)
      .scan(this.add)
      .startWith(0);

  public increaseCount$ = Observable.of(() => {
        this._dispatcher.dispatch("COUNTER_INCREASED")
  });

  public decreaseCount$ = Observable.of(() => {
        this._dispatcher.dispatch("COUNTER_DECREASED")
  });

  constructor(){
    super();
    this.setState({
      test:2,
      func: function(){
        alert(1);
      }
    });
  }

}
