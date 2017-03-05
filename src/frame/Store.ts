import { BehaviorSubject, Observable } from '@reactivex/rxjs';
import {default as storePool} from "./StorePool";
import * as Dispatcher from "./Dispatcher";
import * as counterStore from "../app/counterStore";

const Store = Observable.from([{
  title: "YOLO"
}]);

export default Observable.combineLatest(Store, counterStore.default,
                                        (...stores:any[]) => {
                                          return Object.assign({}, ...stores)
                                        });
