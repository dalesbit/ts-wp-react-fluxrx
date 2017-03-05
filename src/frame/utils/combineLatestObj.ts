import { Observable } from '@reactivex/rxjs'

export function combineLatestObj(obsObj:any) {
    let observables:Array<any> = []
    const keys = Object.keys(obsObj)

    keys.map((key) => {
      observables.push(obsObj[key])
    })

    return Observable.combineLatest(observables, (...args:any[]) => {
      return args.reduce((output, current, i) => {
        return Object.assign(output, {[keys[i]]: current})
      }, {})
    })
  }
