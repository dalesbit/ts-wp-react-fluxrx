import { StreamDecorator,ObservableDecorator,StateDecorator,StoreDecorator } from "../frame/decorators";
import { Store } from "../frame/Store";
import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "../frame/utils/combineLatestObj";

@StoreDecorator
export class UserStore extends Store {

  private users$ = Observable.from([1]).startWith(0);

  constructor(){
    super();
  }

}
