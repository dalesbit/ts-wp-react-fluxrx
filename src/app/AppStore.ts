import { StreamDecorator,ObservableDecorator,StateDecorator,StoreDecorator } from "../frame/decorators";
import { Store } from "../frame/Store";
import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "../frame/utils/combineLatestObj";

@StoreDecorator
export class AppStore extends Store {
  // TODO REDUCE this with a decorator, reducers
  increase = this._dispatcher.getPayload("COUNTER_INCREASED").mapTo(1);
  decrease = this._dispatcher.getPayload("COUNTER_DECREASED").mapTo(-1);

  @StateDecorator
  count: number = 0;

  @ObservableDecorator
  obs: string = "1231231";

  @StreamDecorator
  test: number = 1;

  add(a:any, b:any) {
    return Number(a) + Number(b);
  }


  private counter$ = Observable
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
  }

}
