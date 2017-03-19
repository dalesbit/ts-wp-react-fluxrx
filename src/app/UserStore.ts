import { Property,Store,Action } from "../frame/decorators";
import { StoreManager } from "../frame/Store";
import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import * as Combine from "../frame/utils/combineLatestObj";

@Store
export class UserStore extends StoreManager {

  @Property
  private users = Observable.from([1]).startWith(0);

  constructor(){
    super();
  }

}
