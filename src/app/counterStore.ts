import {Observable} from '@reactivex/rxjs'
import {dispatch, getPayload}  from '../frame/Dispatcher';
import * as Combine from "../frame/utils/combineLatestObj";

/* ========================== state ========================================= */

function add(a:any, b:any) {
  return Number(a) + Number(b);
}

const increase =
  getPayload("COUNTER_INCREASED")
    .mapTo(1)

const decrease =
  getPayload("COUNTER_DECREASED")
    .mapTo(-1)

export const count =
  Observable
    .merge(increase, decrease)
    .scan(add)
    .startWith(0)

/* ========================== handlers ====================================== */
/* Todo: */

export const increaseCount =
  Observable.of(() => {
    dispatch("COUNTER_INCREASED")
  })

export const decreaseCount =
  Observable.of(() => {
    dispatch("COUNTER_DECREASED")
  })

/* ======================== all together ==================================== */

export default Combine.combineLatestObj({count, increaseCount, decreaseCount})
