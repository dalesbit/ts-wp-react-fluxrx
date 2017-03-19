import { Observable } from '@reactivex/rxjs'

export function combineLatestObj<T>(type: { new(): T ;}, reducers:any) {
    let observables:Array<any> = []
    const keys = Object.keys(reducers)

    keys.map((key) => {
      observables.push(reducers[key])
    })
    
    return Observable.combineLatest(...observables, (...args:any[]) => {
      let reduced = args.reduce((output, current, i) => {
        return Object.assign(<T>output, {[keys[i]]: current}) as T;
      }, <T>{}) as T;
      return <T>Object.assign(new type(),reduced);
    })
  }

  export function combineLatestObjFlat(obsObj:any) {
      let observables:Array<any> = []
      const keys = Object.keys(obsObj)

      keys.map((key) => {
        observables.push(obsObj[key])
      })

      return observables
    }
